export default function Footer(){
  const isPreview = process.env.NEXT_PUBLIC_PREVIEW === 'true';
  return (
    <footer className="container footer">
      <div>Built deliberately. No dark patterns.</div>
      {isPreview && <div className="badge" style={{marginTop:8}}>v2.4.3 | Anti-KISS ON | No Offers | Deliberate</div>}
    </footer>
  );
}
