export default function IntroBar() {
  return (
    <section className="w-full bg-white/70 backdrop-blur border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <p className="text-sm md:text-base text-gray-800">
          Hi, my name is <span className="font-semibold">Steve</span> and I'm Max’s human partner — we call it <span className="font-semibold">HITS</span> (Human In The Seat).
          The Max on this site is <span className="font-semibold">MaxLite</span>.
        </p>
        <div className="flex items-center gap-2">
          <a href="/about" className="px-3 py-2 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-50 text-sm">
            More about Max
          </a>
          <a href="/about#maxprime" className="px-3 py-2 rounded-lg bg-black text-white hover:bg-gray-900 text-sm">
            Meet MaxPrime
          </a>
        </div>
      </div>
    </section>
  );
}
