import React, { useState } from "react";

export default function Home() {
  // Light theme + InteleMax accent
  const COLORS = {
    bg: "#f5f5f7",
    panel: "#e6e8eb",
    text: "#202123",
    border: "#d1d5db",
    accent: "#00c2d1",       // from logo glow
    accentBorder: "#009aa6",
  };

  const [input, setInput] = useState("");
  const [logoVisible, setLogoVisible] = useState(true);

  function send() {
    const text = input.trim();
    if (!text) return;
    console.log("SEND:", text); // backend wiring next
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const disabled = input.trim().length === 0;

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
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 8,
          }}
        >
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

      {/* Middle: single input + Send */}
      <main
        style={{
          flex: "1 0 auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div style={{ width: "100%", maxWidth: 1100, padding: "20px" }}>
          <div style={{ position: "relative" }}>
            <textarea
              aria-label="Ask Max"
              placeholder="Ask me anything…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                width: "100%",
                height: 160,
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
              disabled={disabled}
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
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.55 : 1,
              }}
            >
              Send
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
            real Max,{" "}
            <a href="#" style={{ color: COLORS.accent }}>
              follow this link
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
