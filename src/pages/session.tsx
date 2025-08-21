import Header from '@/components/Header';
import Footer from '@/components/Footer';
import IntroBar from '@/components/IntroBar';
import React, { useEffect, useRef, useState } from 'react';

type Msg = { role: 'user' | 'assistant'; content: string };

export default function SessionPage() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, loading]);

  async function send() {
    const value = input.trim();
    if (!value || loading) return;
    if (count >= 10) { alert('Daily free message limit reached.'); return; }

    setInput('');
    const history: Msg[] = [...msgs, { role: 'user', content: value }];
    setMsgs(history);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history, shortMode: false, structure: 'general' }),
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

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  // bubble styles (no Tailwind)
  const bubbleUser: React.CSSProperties = {
    marginLeft: 'auto',
    maxWidth: '85%',
    background: '#f2f2f2',
    color: '#0a0a0a',
    borderRadius: 16,
    padding: '10px 12px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
    whiteSpace: 'pre-wrap',
  };
  const bubbleBot: React.CSSProperties = {
    marginRight: 'auto',
    maxWidth: '85%',
    background: '#1f1f1f',
    color: '#f5f5f5',
    borderRadius: 16,
    padding: '10px 12px',
    whiteSpace: 'pre-wrap',
  };

  return (
    <>
      <Header />
      <IntroBar />

      {/* Chat-first layout (no Tailwind) */}
      <main style={{ minHeight: '100vh', background: '#0b0b0b', color: '#f0f0f0' }}>
        {/* Center column */}
        <div
          style={{
            maxWidth: 960,
            margin: '0 auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 'calc(100vh - 140px)',
          }}
        >
          {/* Title/meta */}
          <header style={{ paddingTop: 16, paddingBottom: 12 }}>
            <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.25, margin: 0 }}>Max • chat</h1>
            <p style={{ margin: '6px 0 0 0', color: '#c9c9c9', fontSize: 14 }}>
              Familiar chat surface. Different behavior.
            </p>
            <div style={{ marginTop: 6, color: '#8a8a8a', fontSize: 12 }}>
              v2.4.3 • mirror | Anti-KISS | No Offers | Deliberate
            </div>
          </header>

          {/* Messages pane */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              border: '1px solid #2a2a2a',
              borderRadius: 12,
              background: 'rgba(20,20,20,0.85)',
              overflowY: 'auto',
              padding: 8,
            }}
          >
            {/* Empty-state greeting */}
            {msgs.length === 0 && (
              <div style={{ color: '#c9c9c9', padding: 8 }}>
                Hi, my name is Max. And yes, I know this page looks A LOT LIKE another AI that you probably work with.
                Ask me a question and I think you&apos;ll see how I&apos;m a bit different :)
              </div>
            )}

            {/* Bubbles */}
            {msgs.map((m, i) => (
              <div key={i} style={{ padding: '10px 8px' }}>
                <div
                  style={{
                    fontSize: 12,
                    opacity: 0.7,
                    marginBottom: 4,
                    textAlign: m.role === 'user' ? 'right' : 'left',
                  }}
                >
                  {m.role === 'user' ? 'You' : 'Max'}
                </div>
                <div style={m.role === 'user' ? bubbleUser : bubbleBot}>{m.content}</div>
              </div>
            ))}

            {loading && (
              <div style={{ padding: '10px 8px' }}>
                <div style={bubbleBot}>(thinking…)</div>
              </div>
            )}
          </div>

          {/* Composer pinned to bottom */}
          <div style={{ position: 'sticky', bottom: 0, background: '#0b0b0b', paddingTop: 12, paddingBottom: 20 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <textarea
                aria-label="Your message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type a message — Press Enter to send, Shift+Enter for newline"
                rows={2}
                maxLength={1500}
                style={{
                  flex: 1,
                  borderRadius: 10,
                  background: '#121212',
                  border: '1px solid #2a2a2a',
                  padding: '10px 12px',
                  color: '#f0f0f0',
                  outline: 'none',
                }}
              />
              <button
                onClick={send}
                disabled={loading}
                style={{
                  padding: '10px 16px',
                  height: 40,
                  borderRadius: 10,
                  background: '#fff',
                  color: '#000',
                  fontWeight: 600,
                  opacity: loading ? 0.6 : 1,
                }}
              >
                Send
              </button>
            </div>
            <div style={{ marginTop: 6, fontSize: 12, color: '#8a8a8a' }}>
              Messages today: {count} / 10
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
