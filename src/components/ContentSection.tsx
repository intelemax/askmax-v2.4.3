export default function ContentSection({heading, items}:{heading?:string; items?:Array<{title:string, body:string}>}){
  return (
    <section className="container">
      {heading && <h2 style={{margin:'12px 0 16px'}}>{heading}</h2>}
      <div className="grid">
        {(items||[]).map((it, i)=>(
          <div key={i} className="card">
            <div style={{fontWeight:600, marginBottom:8}}>{it.title}</div>
            <div style={{opacity:.9}}>{it.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
