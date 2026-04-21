import Link from "next/link";

export function CtaBanner() {
  return (
    <section className="py-6 bg-[#fff5f8]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-pink-500 via-rose-400 to-pink-400 px-8 py-16 md:py-20 text-center">
          {/* Decorative circles */}
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-8 -right-8 w-64 h-64 rounded-full bg-white/10" />
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-20 h-20 rounded-full bg-white/5" />

          <div className="relative z-10">
            <p className="text-pink-100 tracking-widest uppercase text-xs font-semibold mb-4">
              ✦ Limited Time ✦
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Your Glow Awaits.
            </h2>
            <p className="text-pink-100 text-lg max-w-md mx-auto mb-10">
              Order today and experience beauty that lasts. Delivered to your door with care.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/shop"
                className="bg-white text-pink-600 font-bold px-8 py-4 rounded-full text-sm tracking-wide hover:bg-pink-50 transition-colors shadow-lg"
              >
                Shop Now
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white/60 text-white font-semibold px-8 py-4 rounded-full text-sm tracking-wide hover:bg-white/10 transition-colors"
              >
                Ask a Question
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
