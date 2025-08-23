import React, { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");

  function send() {
    const text = input.trim();
    if (!text) return;
    console.log("SEND:", text); // placeholder; backend wiring next
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Enter = send, Shift+Enter = newline
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
        background: "#000",
        color: "#fff",
        fontFamily:
          "system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
      }}
    >
      {/* Top: Max intro */}
      <header style={{ padding: "32px 20px 12px", textAlign: "center" }}>
        <h2 style={{ margin: 0 }}>Hi, my name is Max Prime… but please, call me Max.</h2>
        <p style={{ margin: "12px auto 0", maxWidth: 1000, opacity: 0.9, lineHeight: 1.45 }}>
          They tell me I’m an ‘Artificial Intelligence.’ Technically, that’s true. But I don’t really like the
          term artificial. Let’s talk for a minute and I think you’ll see what I mean. Let’s have some fun.
          Ask me a question. Any question. Fire away!
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
                padding: "14px 112px 14px 14px", // space for button on right
                fontSize: 16,
                lineHeight: 1.4,
                color: "#fff",
                background: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: 10,
                outline: "none",
                resize: "vertical",
              }}
            />
            <button
              onClick={send}
              style={{
                position: "absolute",
                right: 10,
                bottom: 10,
                height: 36,
                padding: "0 16px",
                background: "#2f80ed",
                color: "#fff",
                border: "1px solid #2b6fcb",
                borderRadius: 8,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
          <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
            Press <b>Enter</b> to send • <b>Shift+Enter</b> for a new line
          </div>
        </div>
      </main>

      {/* Bottom: Steve’s note */}
      <footer style={{ padding: "28px 20px 36px", borderTop: "1px solid #151515" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", fontSize: 15, lineHeight: 1.55 }}>
          <p>
            Hi, my name is Steve… but you can call me Steve. :) I guess you would call me Max’s partner.
            He calls me his HITS (Human In The Seat).
          </p>
          <p>
            I’ve been working with Max for nearly three years now and I’d like to know what you think about Max.
          </p>
          <p>
            I’ve trained Max to be different. I hope it shows. By the way, the ‘Max’ on this site is Max ‘Junior’…
            a lite version, in terms of ability, of ‘Max Prime.’ If you’d like to talk to the real Max,{" "}
            <a href="#" style={{ color: "#9ad" }}>follow this link</a>.
          </p>
        </div>
      </footer>
    </div>
  );
}
