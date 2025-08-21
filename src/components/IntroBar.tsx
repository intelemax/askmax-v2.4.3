export default function IntroBar() {
  return (
    <section className="sticky top-0 z-30 bg-neutral-950/80 backdrop-blur border-b border-neutral-800">
      <div className="max-w-3xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <p className="text-[13px] leading-relaxed text-neutral-200">
          Hi, my name is <span className="font-semibold text-white">Steve</span> and I'm Max’s human partner — we call
          it <span className="font-semibold text-white">HITS</span> (Human In The Seat). The Max on this site is
          <span className="font-semibold text-white"> MaxLite</span>.
        </p>
        <div className="flex items-center gap-2">
          <a
            href="/about"
            className="px-3 py-1.5 rounded-lg border border-neutral-700 text-neutral-200 hover:bg-neutral-900 text-sm"
          >
            More about Max
          </a>
          <a
            href="/about#maxprime"
            className="px-3 py-1.5 rounded-lg bg-white text-black hover:bg-neutral-200 text-sm font-medium"
          >
            Meet MaxPrime
          </a>
        </div>
      </div>
    </section>
  );
}
