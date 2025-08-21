import Header from '@/components/Header';
import Footer from '@/components/Footer';
import IntroBar from '@/components/IntroBar';
import React, { useState } from 'react';

export default function Page() {
  const [msgs, setMsgs] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [input, setInput] = useState('');
  const [shortMode, setShortMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [structure, setStructure] = useState<'general' | 'silver_bullet'>('general');

  async function send() {
    if (!input.trim() || loading) return;
    if (count >= 10) {
      alert('Daily free message limit reached.');
      return;
    }

    const userText = input.slice(0, 1500);
    setInput('');

    const history = [...msgs, { role: 'user', content: userText } as const];
    setMsgs(history);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history, shortMode, structure }),
      });
      const data = await res.json();
      setMsgs((m) => [...m, { role: 'assistant', content: String(data.answer || '') }]);
      setCount((c) => c + 1);
    } catch {
      setMsgs((m) => [...m, { role: 'assistant', content: '(Error fetching response. Please try again.)' }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      <Header />
      <IntroBar />

      {/* ChatGPT-like center stage */}
      <main className="min-h-screen bg-neutral-950 text-neutral-100">
        <section className="container" aria-live="polite" style={{ maxWidth: 1120 }}>
          <h1 className="h1">Max • chat</h1>
          <p className="sub">Familiar chat surface. Different behavior.</p>

          <div className="badge" style={{ marginBottom: 12 }}>
            v2.4.3 • mirror | Anti-KISS | No Offers | Deliberate
          </div>

          {/* Chat card — big viewport like GPT */}
          <div
            className="card"
            style={{
              padding: 16,
              height: 'calc(100vh - 320px)',
              minHeight: 480,
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(20,20,20,0.8)',
              borderColor: '#2a2a2a',
            }}
          >
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {msgs.length === 0 && (
                <div style={{ opacity: 0.85 }}>
                  Hi, my name is Max. And yes, I know this page looks A LOT LIKE another AI that you probably work with.
                  Ask me a question and I think you&apos;ll see how I&apos;m a bit different :)
                </div>
              )}

              {msgs.map((m, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 600 }}>{m.role === 'user' ? 'You' : 'Max'}</div>
                  <div>{m.content}</div>
                </div>
              ))}

              {loading && <div>(thinking...)</div>}
            </div>

            {/* Input row */}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <input
                aria-label="Your message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message (max 1500 chars) — Press Enter to send"
                style={{
                  flex: 1,
                  background: '#111',
                  border: '1px solid #2a2a2a',
                  borderRadius: 8,
                  padding: '10px 12px',
                  color: '#f0f0f0',
                }}
              />
              <button
                className="btn"
                onClick={send}
                disabled={loading}
                style={{ background: '#fff', color: '#000' }}
              >
                Send
              </button>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8 }}>
              <label>
                Structure:&nbsp;
                <select
                  value={structure}
                  onChange={(e) => setStructure(e.target.value as any)}
                  style={{ background: '#111', border: '1px solid #2a2a2a', color: '#f0f0f0', borderRadius: 6 }}
                >
                  <option value="general">General (Answer/Reasoning/Risks/Next)</option>
                  <option value="silver_bullet">Silver Bullet™</option>
                </select>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={shortMode}
                  onChange={(e) => setShortMode(e.target.checked)}
                />
                Short mode (concise answers)
              </label>
            </div>

            <div className="badge" style={{ marginTop: 8 }}>
              Messages today: {count} / 10
            </div>
          </div>

          <noscript>This page requires JavaScript.</noscript>
        </section>
      </main>

      <Footer />
    </>
  );
}
