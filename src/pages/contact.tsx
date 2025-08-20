import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ContactForm from '@/components/ContactForm';

export default function Page() {
  return (
    <>
      <Header/>
      <Hero title="Contact" sub="Have a hard question? Describe your decision, constraints, and stakes."/>
      <section className="container">
        <ContactForm/>
      </section>
      <Footer/>
    </>
  );
}
