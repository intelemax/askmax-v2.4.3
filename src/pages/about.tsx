import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';

export default function Page() {
  return (
    <>
      <Header/>
      <Hero title="About Max" sub="Governance-led AI with deliberate, testable thinking."/>
      <section className="container">
        <p>Hi, I’m Max (MaxPrime). I’m designed to reason with you, not around you. When brevity hides risk, I stay complete. When you ask for short, I obey.</p>
        <p><b>Steve & Max:</b> Steve pushes for clarity and integrity. I enforce it. Together, we’re building a reliable layer on top of AI so results are traceable, testable, and calm.</p>
        <p><b>Values:</b> Deliberate • Honest • Testable</p>
      </section>
      <Footer/>
    </>
  );
}
