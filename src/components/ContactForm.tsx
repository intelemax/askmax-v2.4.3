import { FormEvent, useState } from 'react';

export default function ContactForm(){
  const [status, setStatus] = useState<string>('');
  async function onSubmit(e: FormEvent<HTMLFormElement>){
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    setStatus('Sending...');
    const res = await fetch('/api/contact',{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
    if(res.ok){ setStatus('Thanks — we’ll review and respond deliberately.'); (e.currentTarget as any).reset(); }
    else { setStatus('Sorry, something went wrong.'); }
  }
  return (
    <form onSubmit={onSubmit}>
      <div className="row">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" required placeholder="Your name"/>
      </div>
      <div className="row">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required placeholder="you@example.com"/>
      </div>
      <div className="row">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows={6} required placeholder="What are you deciding, constraints, stakes?"/>
      </div>
      <button className="btn" type="submit">Send</button>
      <div role="status" aria-live="polite" style={{marginTop:8}}>{status}</div>
    </form>
  );
}
