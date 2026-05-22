// ───────────────────────────────────────────────────────────────
// src/components/ChatMessage.jsx
//
// One message bubble. Renders:
//  - plain assistant/user text
//  - a side-by-side comparison TABLE when msg.comparison is present
//  - a typing indicator while pending
//  - thumbs up/down feedback under assistant answers
// ───────────────────────────────────────────────────────────────
import { useState } from 'react';

function ComparisonTable({ data }) {
  // data: { attributes: [...], products: [{ name, values: [...] }] }
  if (!data?.attributes || !data?.products) return null;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 mt-1">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left font-semibold text-gray-600 px-3 py-2">
              Attribute
            </th>
            {data.products.map((p) => (
              <th
                key={p.name}
                className="text-left font-semibold text-gray-900 px-3 py-2"
              >
                {p.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.attributes.map((attr, i) => (
            <tr key={attr} className="border-t border-gray-100">
              <td className="px-3 py-2 text-gray-500">{attr}</td>
              {data.products.map((p) => (
                <td key={p.name + i} className="px-3 py-2 text-gray-800">
                  {p.values?.[i] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ChatMessage({ msg, prevUserText }) {
  const isUser = msg.role === 'user';
  const [feedback, setFeedback] = useState(null);

  const sendFeedback = async (rating) => {
    if (feedback) return;
    setFeedback(rating);
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/ai/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          question: prevUserText || '',
          answer: msg.content,
          rating,
        }),
      });
    } catch {
      /* feedback is best-effort — ignore failures */
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed
          ${isUser
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}
      >
        {msg.pending && !msg.content ? (
          <span className="inline-flex gap-1 py-1">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.15s]" />
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.3s]" />
          </span>
        ) : msg.comparison ? (
          <ComparisonTable data={msg.comparison} />
        ) : (
          <span className="whitespace-pre-wrap">{msg.content}</span>
        )}

        {!isUser && !msg.pending && (msg.content || msg.comparison) && (
          <div className="flex gap-2 mt-2 pt-1">
            <button
              onClick={() => sendFeedback('up')}
              className={`text-xs px-1.5 rounded ${
                feedback === 'up' ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-label="Helpful"
            >
              👍
            </button>
            <button
              onClick={() => sendFeedback('down')}
              className={`text-xs px-1.5 rounded ${
                feedback === 'down' ? 'text-red-600' : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-label="Not helpful"
            >
              👎
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
