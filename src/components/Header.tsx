'use client'
import Link from 'next/link';
import { useState } from 'react';

export default function Header(){
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container navbar">
        <Link href="/" className="brand">AskMax</Link>
        <button className="btn menu-btn" aria-label="Toggle menu" onClick={()=>setOpen(o=>!o)}>Menu</button>
        <nav className={`navlinks ${open ? 'open' : ''}`}>
          <Link href="/about">About</Link>
          <Link href="/silver-bullet">Silver Bullet™</Link>
          <Link href="/tope">TOPE</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/session" className="btn">Start a session</Link>
        </nav>
      </div>
    </header>
  );
}
