import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';

export default function Page() {
  return (
    <>
      <Header/>
      <Hero title="TOPE" sub="Team of Persona Experts that keep thinking rigorous."/>
      <section className="container">
        <div className="grid">
          <div className="card">
            <div style={{fontWeight:600}}>Arden — AI Training Architect</div>
            <div>Scopes training data, curricula, and evaluations.</div>
          </div>
          <div className="card">
            <div style={{fontWeight:600}}>Lex — Prompt Engineering Director</div>
            <div>Designs prompts, guardrails, and test harnesses.</div>
          </div>
        </div>
      </section>
      <Footer/>
    </>
  );
}
