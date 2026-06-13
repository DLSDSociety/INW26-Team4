// ───────────────────────────────────────────────────────────────
// src/components/ChatWidget.jsx
//
// Floating chat launcher + panel. Drop <ChatWidget /> ONCE in App.jsx
// (outside <Routes>) so it floats on every page.
//
// Week 11 : toggle, message history, typing indicator, streaming
// Week 13 : welcome message, suggested questions, clear button,
//           "Powered by AI" disclaimer
// ───────────────────────────────────────────────────────────────
import { useState, useEffect, useRef } from 'react';
import useChat from '../hooks/useChat';
import ChatMessage from './ChatMessage';

const SUGGESTIONS = [
  'What laptops do you have?',
  'Compare the two cheapest phones',
  'Where is my latest order?',
  'What is your return policy?',
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, streaming, send, reset } = useChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const submit = (e) => {
    e?.preventDefault();
    if (!input.trim()) return;
    send(input);
    setInput('');
  };

  // Only the welcome card is showing → offer starter questions.
  const showSuggestions = messages.length === 1;

  return (
    <>
      {/* Launcher button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full
                   bg-blue-600 text-white shadow-lg hover:bg-blue-700
                   transition flex items-center justify-center text-2xl"
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? '✕' : '💬'}
      </button>

      {/* Panel */}
      {open && (
        <div
          className="fixed bottom-24 right-5 z-50 w-[92vw] max-w-sm
                     h-[70vh] max-h-[560px] bg-white rounded-2xl
                     shadow-2xl border border-gray-200 flex flex-col
                     overflow-hidden"
        >
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 flex
                          items-center justify-between">
            <div>
              <p className="font-semibold leading-tight">ShopBot</p>
              <p className="text-[11px] text-blue-100">
                AI shopping assistant
              </p>
            </div>
            <button
              onClick={reset}
              className="text-xs text-blue-100 hover:text-white
                         border border-blue-400 rounded-md px-2 py-1"
            >
              Clear
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {messages.map((m, i) => (
              <ChatMessage
                key={i}
                msg={m}
                prevUserText={messages[i - 1]?.content}
              />
            ))}

            {showSuggestions && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs bg-blue-50 text-blue-700
                               border border-blue-100 rounded-full
                               px-3 py-1.5 hover:bg-blue-100 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={submit}
            className="border-t border-gray-100 p-3 flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products, orders…"
              disabled={streaming}
              className="flex-1 text-sm border border-gray-200
                         rounded-xl px-3 py-2 outline-none
                         focus:border-blue-400 disabled:bg-gray-50"
            />
            <button
              type="submit"
              disabled={streaming || !input.trim()}
              className="bg-blue-600 text-white text-sm font-semibold
                         px-4 rounded-xl hover:bg-blue-700 transition
                         disabled:opacity-50"
            >
              {streaming ? '…' : 'Send'}
            </button>
          </form>

          <p className="text-[10px] text-gray-400 text-center pb-2">
            Powered by AI · answers may occasionally be inaccurate
          </p>
        </div>
      )}
    </>
  );
}
