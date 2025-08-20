import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';

export default function Page() {
  return (
    <>
      <Header/>
      <Hero title="Silver Bullet™" sub="A clear, testable way to compare choices without hype."/>
      <section className="container">
        <h2>What it is</h2>
        <p>Silver Bullet™ is our comparison frame — requirements, constraints, trade-offs, measurable outcomes. It kills fluff.</p>

        <h2>When to use</h2>
        <ul><li>Choosing tools, vendors, architectures, or offers.</li></ul>

        <h2>Mini example (abstract)</h2>
        <ol>
          <li>Goal</li><li>Options</li><li>Trade-offs</li><li>Decision</li><li>Test you can run tomorrow</li>
        </ol>
      </section>
      <Footer/>
    </>
  );
}
