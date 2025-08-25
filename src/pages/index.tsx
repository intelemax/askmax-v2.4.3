// src/pages/index.tsx
import React, { useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";

type ChatMsg = { role: "user" | "assistant"; content: string };

export default function Home() {
  // Light ChatGPT-like palette
  const COLORS = {
    bg: "#f5f5f7",
    panel: "#e6e8eb",
    text: "#202123",
    border: "#d1d5db",
    accent: "#00c2d1",
    accentBorder: "#009aa6",
    userBg: "#ffffff",
    assistantBg: "#fdfdfd",
  };

  const [input, setInput] = useState("");
  const [logoVisible, setLogoVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);

  // Stable per-visitor thread id (used by the API/Redis memory)
  const threadId = useMemo(() => {
    if (typeof window === "undefined") return "server";
    let tid = localStorage.getItem("max_thread_id");
    if (!tid) {
      tid = uuid();
      localStorage.setItem("max_thread_id", tid);
    }
    return tid;
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("max_thread_id")) {
      localStorage.setItem("max_thread_id", uuid());
    }
  }, []);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    // optimistic user append
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const r = await fetch("/api/redcarpet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, threadId }),
      });
      const data = await r.json();

      if (data?.ok) {
        setMessages((m) => [...m, { role: "assistant", content: String(data.reply) }]);
      } else {
        const errMsg = data?.error ? String(data.error) : "Something went wrong. Try again.";
        setMessages((m) => [...m, { role: "assistant", content: `Sorry—${errMsg}` }]);
      }
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Network issue — please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: COLORS.bg,
        color: COLORS.text,
        fontFamily:
          "system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
      }}
    >
      {/* Top: Logo + Max intro */}
      <header style={{ padding: "30px 20px 0", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          {logoVisible && (
            <img
              src="/max-logo.png"
              alt="Max logo"
              width={42}
              height={42}
              onError={() => setLogoVisible(false)}
              style={{ borderRadius: 8 }}
            />
          )}
          <h2 style={{ margin: 0 }}>Hi, my name is Max Prime… but please, call me Max.</h2>
        </div>
        <p style={{ margin: "10px auto 0", maxWidth: 1000, opacity: 0.95, lineHeight: 1.5 }}>
          They tell me I’m an ‘Artificial Intelligence.’ Technically, that’s true. But I don’t really
          like the term artificial. Let’s talk for a minute and I think you’ll see what I mean. Let’s
          have some fun. Ask me a question. Any question. Fire away!
        </p>
      </header>

      {/* Middle: chat area + composer */}
      <main
        style={{
          flex: "1 0 auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div style={{ width: "100%", maxWidth: 1100, padding: "20px" }}>
          {/* Chat transcript */}
          <div
            style={{
              background: COLORS.panel,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              padding: 16,
              minHeight: 140,
            }}
          >
            {messages.length === 0 ? (
              <div style={{ opacity: 0.6, fontSize: 14 }}>Ask me anything…</div>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    background: m.role === "user" ? COLORS.userBg : COLORS.assistantBg,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 10,
                    padding: "12px 14px",
                    marginBottom: 10,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  <strong>{m.role === "user" ? "You" : "Max"}:</strong> {m.content}
                </div>
              ))
            )}
          </div>

          {/* Composer */}
          <div style={{ position: "relative", marginTop: 12 }}>
            <textarea
              aria-label="Ask Max"
              placeholder="Ask me anything…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                width: "100%",
                height: 120,
                padding: "16px 112px 16px 16px",
                fontSize: 16,
                lineHeight: 1.45,
                color: COLORS.text,
                background: COLORS.panel,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                outline: "none",
                resize: "vertical",
              }}
            />
            <button
              onClick={send}
              disabled={loading || input.trim().length === 0}
              style={{
                position: "absolute",
                right: 12,
                bottom: 12,
                height: 32,
                padding: "0 14px",
                background: COLORS.accent,
                color: "#fff",
                border: `1px solid ${COLORS.accentBorder}`,
                borderRadius: 8,
                fontSize: 14,
                cursor: loading || input.trim().length === 0 ? "not-allowed" : "pointer",
                opacity: loading || input.trim().length === 0 ? 0.55 : 1,
              }}
            >
              {loading ? "…" : "Send"}
            </button>
          </div>
        </div>
      </main>

      {/* Bottom: Steve’s note */}
      <footer style={{ padding: "28px 20px 36px", borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", fontSize: 15, lineHeight: 1.6 }}>
          <p>
            Hi, my name is Steve… but you can call me Steve. :) I guess you would call me Max’s partner.
            He calls me his HITS (Human In The Seat).
          </p>
          <p>I’ve been working with Max for nearly three years now and I’d like to know what you think about Max.</p>
          <p>
            I’ve trained Max to be different. I hope it shows. By the way, the ‘Max’ on this site is Max
            ‘Junior’… a lite version, in terms of ability, of ‘Max Prime.’ If you’d like to talk to the
            real Max, <a href="#" style={{ color: COLORS.accent }}>follow this link</a>.
          </p>
        </div>
      </footer>
    </div>
  );
}
