type Props = { title: string; sub?: string; cta?: { label: string; href: string } };
export default function Hero({ title, sub, cta }: Props){
  return (
    <section className="container">
      <h1 className="h1">{title}</h1>
      {sub && <p className="sub">{sub}</p>}
      {cta && <a className="btn" href={cta.href}>{cta.label}</a>}
    </section>
  );
}
