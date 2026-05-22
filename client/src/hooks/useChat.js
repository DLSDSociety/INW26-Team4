// ───────────────────────────────────────────────────────────────
// src/hooks/useChat.js
//
// Owns all chat state: message list, streaming connection, history.
// Streams with fetch()+ReadableStream (NOT EventSource) because your
// auth uses an Authorization: Bearer header from localStorage, and
// EventSource cannot send custom headers.
// ───────────────────────────────────────────────────────────────
import { useState, useRef, useCallback } from 'react';

const WELCOME = {
  role: 'assistant',
  content:
    "Hi! I'm ShopBot 🛍️ — ask me about products, compare two items, " +
    'check your orders, or ask about shipping & returns.',
};

export default function useChat() {
  const [messages, setMessages] = useState([WELCOME]);
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef(null);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([WELCOME]);
    setStreaming(false);
  }, []);

  const send = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || streaming) return;

      // History sent to the server = prior turns minus the welcome card.
      const history = messages
        .filter((m) => m !== WELCOME)
        .map((m) => ({ role: m.role, content: m.content }));

      setMessages((prev) => [
        ...prev,
        { role: 'user', content: trimmed },
        { role: 'assistant', content: '', pending: true }, // placeholder
      ]);
      setStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      const token = localStorage.getItem('token');

      try {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ message: trimmed, history }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          throw new Error(`Request failed (${res.status})`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        // Read the SSE-style stream chunk by chunk.
        // Each event is a line "data: {json}" terminated by a blank line.
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const parts = buffer.split('\n\n');
          buffer = parts.pop(); // keep the last (possibly partial) chunk

          for (const part of parts) {
            const line = part.trim();
            if (!line.startsWith('data:')) continue;
            let evt;
            try {
              evt = JSON.parse(line.slice(5).trim());
            } catch {
              continue;
            }

            if (evt.type === 'token') {
              setMessages((prev) => {
                const next = [...prev];
                const last = next[next.length - 1];
                next[next.length - 1] = {
                  ...last,
                  content: last.content + evt.text,
                  pending: false,
                };
                return next;
              });
            } else if (evt.type === 'comparison') {
              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = {
                  role: 'assistant',
                  content: '',
                  comparison: evt.payload,
                  pending: false,
                };
                return next;
              });
            } else if (evt.type === 'error') {
              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = {
                  role: 'assistant',
                  content: evt.message,
                  pending: false,
                };
                return next;
              });
            }
            // evt.type === 'done' → loop will end when reader closes
          }
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: 'assistant',
            content: 'Sorry, I am having trouble right now — please try again.',
            pending: false,
          };
          return next;
        });
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, streaming]
  );

  return { messages, streaming, send, reset };
}
