const REVIEWS = [
  {
    name: "Amara L.",
    avatar: "🧕",
    rating: 5,
    text: "The Vitamin C serum transformed my skin in just 2 weeks. Absolutely glowing!",
    product: "Vitamin C Serum",
  },
  {
    name: "Sophie R.",
    avatar: "👩",
    rating: 5,
    text: "I've tried dozens of lip colors — nothing compares to Glowish. Long-lasting and so creamy.",
    product: "Velvet Lip Color",
  },
  {
    name: "Priya M.",
    avatar: "👩🏽",
    rating: 5,
    text: "Clean ingredients, beautiful packaging, fast delivery. This is my go-to brand now.",
    product: "Rose Toner",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-12 sm:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center amb-8 sm:mb-14">
          <p className="text-[#333333]/60 tracking-widest uppercase text-xs font-semibold mb-2">Reviews</p>
          <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#333333]">
            Real Glow. Real People.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {REVIEWS.map((r, i) => (
            <div
              key={i}
              className="relative bg-white border border-[#333333]/10 rounded-none p-5 sm:p-7 hover:-translate-y-1 transition-transform duration-300 shadow-sm"
            >
              {/* Quote mark */}
              <div className="absolute top-4 right-5 sm:top-5 sm:right-6 text-5xl sm:text-6xl text-gray-100 font-display leading-none select-none">"</div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-3 sm:mb-4">
                {[...Array(r.rating)].map((_, s) => (
                  <span key={s} className="text-[#333333] text-xs sm:text-sm">★</span>
                ))}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-4 sm:mb-6 relative z-10">
                "{r.text}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-none bg-[#fff0f5] flex items-center justify-center text-lg sm:text-xl flex-shrink-0">
                  {r.avatar}
                </div>
                <div>
                  <p className="font-semibold text-[#333333] text-sm">{r.name}</p>
                  <p className="text-gray-500 text-xs">{r.product}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
