// utils/llmClient.js  —  Groq (chat) + Gemini (embeddings), both free

const MODEL = process.env.AI_MODEL || 'llama-3.3-70b-versatile';
const EMBED_MODEL = process.env.AI_EMBED_MODEL || 'gemini-embedding-001';

const GROQ_BASE = 'https://api.groq.com/openai/v1';
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';

function groqKey() {
  if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY missing in .env');
  return process.env.GROQ_API_KEY;
}
function geminiKey() {
  if (!process.env.GOOGLE_API_KEY) throw new Error('GOOGLE_API_KEY missing in .env');
  return process.env.GOOGLE_API_KEY;
}

// ── Daily token meter ──────────────────────────────────────────
let tokensUsedToday = 0;
let budgetDate = new Date().toDateString();
const DAILY_TOKEN_BUDGET = Number(process.env.AI_DAILY_TOKEN_BUDGET || 2_000_000);
function rollBudgetIfNewDay() {
  const today = new Date().toDateString();
  if (today !== budgetDate) { budgetDate = today; tokensUsedToday = 0; }
}
function budgetExceeded() { rollBudgetIfNewDay(); return tokensUsedToday >= DAILY_TOKEN_BUDGET; }
function budgetStatus()   { rollBudgetIfNewDay(); return { used: tokensUsedToday, limit: DAILY_TOKEN_BUDGET }; }
function recordUsage(u) {
  if (!u) return;
  tokensUsedToday += (u.prompt_tokens || 0) + (u.completion_tokens || 0);
}

// ── Convert our {role, content} → Groq's OpenAI-style messages ─
// Groq uses 'system' | 'user' | 'assistant', so almost a no-op,
// but we prepend the system prompt as the first system message.
function toGroqMessages(system, messages) {
  const out = [];
  if (system) out.push({ role: 'system', content: system });
  for (const m of messages) {
    if (!m || !m.content) continue;
    out.push({ role: m.role === 'model' ? 'assistant' : m.role, content: m.content });
  }
  return out;
}

// ═══════════════════════════════════════════════════════════════
// 1. streamChat — OpenAI-style SSE from Groq
// ═══════════════════════════════════════════════════════════════
async function streamChat({ system, messages, onToken, maxTokens = 800 }) {
  const res = await fetch(`${GROQ_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${groqKey()}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: toGroqMessages(system, messages),
      stream: true,
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });

  if (!res.ok || !res.body) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Groq stream failed: ${res.status} ${errText}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  let full = '';
  let lastUsage = null;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });

    const events = buf.split('\n\n');
    buf = events.pop();

    for (const ev of events) {
      const line = ev.trim();
      if (!line.startsWith('data:')) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === '[DONE]') continue;

      let json;
      try { json = JSON.parse(payload); } catch { continue; }

      const text = json?.choices?.[0]?.delta?.content;
      if (text) {
        full += text;
        if (onToken) onToken(text);
      }
      if (json?.x_groq?.usage) lastUsage = json.x_groq.usage;
    }
  }

  recordUsage(lastUsage);
  return full;
}

// ═══════════════════════════════════════════════════════════════
// 2. classifyIntent — non-streaming JSON via Groq
// ═══════════════════════════════════════════════════════════════
async function classifyIntent(userMessage) {
  const systemText =
    'You are an intent classifier for an e-commerce shopping assistant. ' +
    'Reply with ONLY a JSON object, no markdown fences, no prose. Schema: ' +
    '{"intent":"product_qa|compare|order|faq|unknown",' +
    '"productNames":["..."]}. ' +
    'Use "compare" only when the user clearly wants two or more products ' +
    'compared, and put the product names in productNames. ' +
    'Use "order" for anything about the user\'s orders, delivery, or tracking. ' +
    'Use "faq" for shipping, returns, refunds, payment-method, or policy questions. ' +
    'Use "product_qa" for questions about a specific product or recommendations. ' +
    'Use "unknown" for greetings, off-topic, or unclear messages.';

  const res = await fetch(`${GROQ_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${groqKey()}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemText },
        { role: 'user', content: userMessage },
      ],
      response_format: { type: 'json_object' }, // Groq supports this
      max_tokens: 150,
      temperature: 0,
    }),
  });

  if (!res.ok) return { intent: 'unknown', productNames: [] };

  const data = await res.json();
  recordUsage(data.usage);

  const raw = data?.choices?.[0]?.message?.content?.trim() || '';
  try {
    const clean = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    return {
      intent: parsed.intent || 'unknown',
      productNames: Array.isArray(parsed.productNames) ? parsed.productNames : [],
    };
  } catch {
    return { intent: 'unknown', productNames: [] };
  }
}

// ═══════════════════════════════════════════════════════════════
// 3. embedText — Gemini embeddings (separate quota from chat)
// ═══════════════════════════════════════════════════════════════
async function embedText(text) {
  const url = `${GEMINI_BASE}/models/${EMBED_MODEL}:embedContent?key=${geminiKey()}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: `models/${EMBED_MODEL}`,
      content: { parts: [{ text }] },
      outputDimensionality: 768,
      taskType: 'RETRIEVAL_DOCUMENT',
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Embedding failed: ${res.status} ${body}`);
  }
  const data = await res.json();
  return data.embedding.values;
}

module.exports = { streamChat, classifyIntent, embedText, budgetExceeded, budgetStatus, MODEL };