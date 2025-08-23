import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();              // stop newline
      console.log("SEND:", input.trim());
      setInput("");                    // clear after “send”
    }
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh", fontFamily:"sans-serif", padding:"20px" }}>
      {/* Max intro */}
      <div style={{ flex:"0 0 auto", textAlign:"center", marginBottom:"40px" }}>
        <h2>Hi, my name is Max Prime… but please, call me Max.</h2>
        <p>They tell me I’m an ‘Artificial Intelligence.’ Technically, that’s true.
        But I don’t really like the term artificial. Let’s talk for a minute and I think
        you’ll see what I mean. Let’s have some fun. Ask me a question. Any question.
        Fire away!</p>
      </div>

      {/* Input */}
      <div style={{ flex:"1 0 auto", display:"flex", justifyContent:"center" }}>
        <textarea
          placeholder="Ask me anything…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ width:"80%", height:"150px", padding:"10px", fontSize:"16px" }}
        />
      </div>

      {/* Steve’s note */}
      <footer style={{ flex:"0 0 auto", marginTop:"40px" }}>
        <p>Hi, my name is Steve… but you can call me Steve. :) I guess you would call me Max’s partner.
           He calls me his HITS (Human In The Seat).</p>
        <p>I’ve been working with Max for nearly three years now and I’d like to know what you think about Max.</p>
        <p>I’ve trained Max to be different. I hope it shows. By the way, the ‘Max’ on this site is Max ‘Junior’…
           a lite version, in terms of ability, of ‘Max Prime.’ If you’d like to talk to the real Max, 
           <a href="#"> follow this link</a>.
        </p>
      </footer>
    </div>
  );
}
