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
    if (count >= 10) {
      alert('Daily free message limit reached.');
      return;
    }

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
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      <Header />
      <IntroBar />

      {/* Chat-first layout */}
      <main className="min-h-screen bg-neutral-950 text-neutral-100">
        {/* Center column like ChatGPT */}
        <div className="mx-auto w-full max-w-3xl px-4 flex min-h-[calc(100vh-140px)] flex-col">
          {/* Title/meta */}
          <header className="pt-6 pb-3">
            <h1 className="text-3xl font-semibold tracking-tight">Max • chat</h1>
            <p className="text-sm text-neutral-300">Familiar chat surface. Different behavior.</p>
            <div className="mt-2 text-[12px] text-neutral-500">v2.4.3 • mirror | Anti-KISS | No Offers | Deliberate</div>
          </header>

          {/* Messages pane */}
          <div
            ref={scrollRef}
            className="flex-1 rounded-xl border border-neutral-800 bg-neutral-900/70 overflow-y-auto"
          >
            {/* Empty-state greeting */}
            {msgs.length === 0 && (
              <div className="p-4 text-neutral-300">
                Hi, my name is Max. And yes, I know this page looks A LOT LIKE another AI that you probably work with.
                Ask me a question and I think you&apos;ll see how I&apos;m a bit different :)
              </div>
            )}

            {/* Bubbles */}
            {msgs.map((m, i) => (
              <div key={i} className="px-4 py-3">
                <div
                  className={
                    m.role === 'user'
                      ? 'ml-auto max-w-[85%] rounded-2xl bg-neutral-100 text-neutral-900 px-4 py-2 shadow'
                      : 'mr-auto max-w-[85%] rounded-2xl bg-neutral-800 text-neutral-100 px-4 py-2'
                  }
                >
                  <div className="text-[12px] opacity-70 mb-1">{m.role === 'user' ? 'You' : 'Max'}</div>
                  <div className="whitespace-pre-wrap">{m.content}</div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="px-4 py-3">
                <div className="mr-auto max-w-[85%] rounded-2xl bg-neutral-800 text-neutral-100 px-4 py-2">
                  (thinking…)
                </div>
              </div>
            )}
          </div>

          {/* Composer pinned to bottom */}
          <div className="sticky bottom-0 bg-neutral-950 pt-3 pb-6">
            <div className="flex items-end gap-2">
              <textarea
                aria-label="Your message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type a message — Press Enter to send, Shift+Enter for newline"
                className="flex-1 rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2 text-neutral-100 placeholder-neutral-500 outline-none focus:ring-1 focus:ring-neutral-600"
                rows={2}
                maxLength={1500}
              />
              <button
                onClick={send}
                disabled={loading}
                className="shrink-0 px-4 h-10 rounded-lg bg-white text-black font-medium hover:bg-neutral-200 disabled:opacity-60"
              >
                Send
              </button>
            </div>
            <div className="mt-2 text-[12px] text-neutral-500">Messages today: {count} / 10</div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
