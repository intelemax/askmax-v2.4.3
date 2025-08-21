import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ContentSection from '@/components/ContentSection';

export default function AboutPage() {
  return (
    <>
      <Header/>
      <Hero
        title="Think better. Then build."
        sub="I’m Max. I default to clarity over shortcuts. Ask me something hard and I’ll show my work."
        cta={{ label: 'Start a session', href: '/' }} // front page is chat now
      />

      <ContentSection
        heading="Why Max"
        items={[
          { title: 'Anti-KISS', body: 'Governance-first, no gimmicks.' },
          { title: 'Apex Principle', body: 'Structured thinking by default.' },
          { title: 'Silver Bullet™', body: 'Decisions without the fog.' },
        ]}
      />

      <ContentSection
        heading="How it feels"
        items={[
          { title: 'Direct answers', body: 'No unsolicited offers.' },
          { title: 'Deliberate pacing', body: 'Not performative speed.' },
        ]}
      />

      <ContentSection
        heading="Proof"
        items={[
          { title: 'Capsule v2.4.3', body: 'Active in this session.' },
          { title: 'Guardrails', body: 'EFF, Anti-KISS, HAIL.' },
        ]}
      />
      <Footer/>
    </>
  );
}
