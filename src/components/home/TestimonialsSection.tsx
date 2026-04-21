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
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-pink-400 tracking-widest uppercase text-xs font-semibold mb-2">Reviews</p>
          <h2 className="font-display text-4xl font-bold text-pink-900">
            Real Glow. Real People.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((r, i) => (
            <div
              key={i}
              className="relative bg-gradient-to-br from-pink-50 to-white border border-pink-100 rounded-3xl p-7 hover:-translate-y-1 transition-transform duration-300"
            >
              {/* Quote mark */}
              <div className="absolute top-5 right-6 text-6xl text-pink-100 font-display leading-none select-none">"</div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(r.rating)].map((_, s) => (
                  <span key={s} className="text-pink-400 text-sm">★</span>
                ))}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-6 relative z-10">
                "{r.text}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-xl">
                  {r.avatar}
                </div>
                <div>
                  <p className="font-semibold text-pink-800 text-sm">{r.name}</p>
                  <p className="text-pink-400 text-xs">{r.product}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
