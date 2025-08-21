export default function IntroBar() {
  return (
    <section
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        background: 'rgba(10,10,10,0.9)',
        backdropFilter: 'blur(6px)',
        borderBottom: '1px solid #2a2a2a',
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: '0 auto',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: '#d6d6d6' }}>
          Hi, my name is <span style={{ fontWeight: 600, color: '#fff' }}>Steve</span> and I'm Max’s human partner — we
          call it <span style={{ fontWeight: 600, color: '#fff' }}>HITS</span>. The Max on this site is{' '}
          <span style={{ fontWeight: 600, color: '#fff' }}>MaxLite</span>.
        </p>

        <div style={{ display: 'flex', gap: 8 }}>
          <a
            href="/about"
            style={{
              padding: '8px 12px',
              borderRadius: 10,
              border: '1px solid #3a3a3a',
              color: '#eaeaea',
              textDecoration: 'none',
            }}
          >
            More about Max
          </a>
          <a
            href="/about#maxprime"
            style={{
              padding: '8px 12px',
              borderRadius: 10,
              background: '#fff',
              color: '#000',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Meet MaxPrime
          </a>
        </div>
      </div>
    </section>
  );
}
