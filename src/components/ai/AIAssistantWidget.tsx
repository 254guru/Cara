'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type SuggestedProduct = {
  id: number;
  title: string;
  brand: string;
  price: number;
};

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function AIAssistantWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'I can help you find products by style, color, and budget. Try: blue t-shirt under 3000.' },
  ]);
  const [suggestions, setSuggestions] = useState<SuggestedProduct[]>([]);

  useEffect(() => {
    const savedSessionId = window.localStorage.getItem('cara-ai-session-id');

    const url = savedSessionId
      ? `/api/ai/assistant?sessionId=${encodeURIComponent(savedSessionId)}`
      : '/api/ai/assistant';

    void (async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) return;
        const data = (await res.json()) as {
          sessionId: string | null;
          messages: Message[];
        };

        if (data.sessionId) {
          setSessionId(data.sessionId);
          window.localStorage.setItem('cara-ai-session-id', data.sessionId);
        }

        if (Array.isArray(data.messages) && data.messages.length > 0) {
          setMessages(data.messages);
        }
      } catch {
        // Keep local default assistant greeting when fetch fails.
      }
    })();
  }, []);

  async function sendMessage() {
    const text = input.trim();
    if (!text || busy) return;

    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setBusy(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId }),
      });

      if (!res.ok) {
        throw new Error('Assistant request failed');
      }

      const data = (await res.json()) as {
        reply: string;
        suggestedProducts: SuggestedProduct[];
        sessionId?: string | null;
      };

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      setSuggestions(data.suggestedProducts || []);

      if (data.sessionId) {
        setSessionId(data.sessionId);
        window.localStorage.setItem('cara-ai-session-id', data.sessionId);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'I ran into a network issue. Please try again in a moment.' },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ai-widget" aria-live="polite">
      {open && (
        <div className="ai-panel" role="dialog" aria-label="AI shopping assistant">
          <div className="ai-panel-head">
            <h3>Cara AI</h3>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close assistant">
              <i className="fas fa-times" />
            </button>
          </div>

          <div className="ai-messages">
            {messages.map((m, idx) => (
              <div key={idx} className={`ai-msg ${m.role}`}>
                {m.content}
              </div>
            ))}
          </div>

          {suggestions.length > 0 && (
            <div className="ai-suggestions">
              {suggestions.slice(0, 3).map((p) => (
                <Link key={p.id} href={`/shop/${p.id}`}>
                  {p.title} · KES {p.price.toLocaleString('en-KE')}
                </Link>
              ))}
            </div>
          )}

          <div className="ai-input-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe what you want..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  void sendMessage();
                }
              }}
            />
            <button type="button" onClick={() => void sendMessage()} disabled={busy}>
              {busy ? '...' : 'Send'}
            </button>
          </div>
        </div>
      )}

      <button className="ai-fab" type="button" onClick={() => setOpen((v) => !v)} aria-label="Open AI assistant">
        <i className="fas fa-sparkles" />
        <span>AI</span>
      </button>
    </div>
  );
}
