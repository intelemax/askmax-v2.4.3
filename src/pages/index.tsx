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

      <main style={{ minHeight: '100vh', background: '#0b0b0b', color: '#f0f0f0' }}>
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
          <header style={{ paddingTop: 16, paddingBottom: 6 }}>
            <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.25, margin: 0 }}>Max • chat</h1>
            <div style={{ marginTop: 4, color: '#a8a8a8', fontSize: 12 }}>
              v2.4.3 • mirror | Anti-KISS | No Offers | Deliberate
            </div>
          </header>

          {/* Chat pane */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              border: '1px solid #2a2a2a',
              borderRadius: 12,
              background: 'rgba(22,22,22,0.95)',
              overflowY: 'auto',
              padding: 12,
              boxShadow: '0 4px 20px rgba(0,0,0,0.25) inset',
              minHeight: 520,
            }}
          >
            {msgs.length === 0 && (
              <div style={{ color: '#c9c9c9', padding: 4 }}>
                Hi, my name is Max. And yes, I know this page looks A LOT LIKE another AI that you probably work with.
                Ask me a question and I think you&apos;ll see how I&apos;m a bit different :)
              </div>
            )}

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

          {/* Composer container (looks like ChatGPT) */}
          <div style={{ position: 'sticky', bottom: 0, background: '#0b0b0b', paddingTop: 12, paddingBottom: 20 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: '#121212',
                border: '1px solid #2a2a2a',
                borderRadius: 12,
                padding: 6,
              }}
            >
              <textarea
                aria-label="Your message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Message Max — Enter to send, Shift+Enter for newline"
                rows={2}
                maxLength={1500}
                style={{
                  flex: 1,
                  borderRadius: 8,
                  background: 'transparent',
                  border: 'none',
                  padding: '8px 10px',
                  color: '#f0f0f0',
                  outline: 'none',
                  resize: 'none',
                }}
              />
              <button
                onClick={send}
                disabled={loading}
                style={{
                  padding: '10px 14px',
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
            <div style={{ marginTop: 6, fontSize: 12, color: '#8a8a8a' }}>Messages today: {count} / 10</div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
