import Link from "next/link";

const CATEGORIES = [
  {
    label: "Skin Care",
    category: "SkinCare",
    emoji: "✨",
    desc: "Serums, moisturizers & more",
    bg: "from-[#fff0f5] to-white",
    accent: "bg-[#333333]/10",
    border: "border-[#333333]/10",
  },
  {
    label: "Makeup",
    category: "Makeup",
    emoji: "💄",
    desc: "Lips, eyes & face",
    bg: "from-white to-[#fff0f5]",
    accent: "bg-[#333333]/10",
    border: "border-[#333333]/10",
  },
  {
    label: "Fragrance",
    category: "Fragrance",
    emoji: "🌺",
    desc: "Perfumes & body mists",
    bg: "from-[#fff0f5] to-[#f8f8f8]",
    accent: "bg-[#333333]/10",
    border: "border-[#333333]/10",
  },
  {
    label: "Hair",
    category: "Hair",
    emoji: "💆",
    desc: "Oils, masks & treatments",
    bg: "from-[#f8f8f8] to-[#fff0f5]",
    accent: "bg-[#333333]/10",
    border: "border-[#333333]/10",
  },
];

export function CategorySection() {
  return (
    <section className="py-12 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 sm:mb-12">
          <div>
            <p className="text-[#333333]/60 tracking-widest uppercase text-xs font-semibold mb-2">Categories</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#333333]">Shop by Ritual</h2>
          </div>
          <Link href="/shop" className="flex items-center gap-2 text-[#333333] font-semibold text-sm hover:gap-3 transition-all">
            View All <span>→</span>
          </Link>
        </div>

        {/* Grid — equal cards on all screen sizes */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.category}
              href={`/shop?category=${cat.category}`}
              className={`group relative rounded-2xl sm:rounded-3xl bg-gradient-to-br ${cat.bg} border ${cat.border} overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#333333]/5`}
            >
              <div className="p-4 sm:p-6 flex flex-col min-h-[140px] sm:min-h-[170px]">
                {/* Emoji bubble */}
                <div className={`w-10 h-10 sm:w-14 sm:h-14 ${cat.accent} rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-3xl mb-auto group-hover:scale-110 transition-transform duration-300`}>
                  {cat.emoji}
                </div>

                <div className="mt-6 sm:mt-8">
                  <h3 className="font-display font-bold text-[#333333] text-base sm:text-xl mb-0.5">{cat.label}</h3>
                  <p className="text-[#333333]/70 text-xs sm:text-sm hidden sm:block">{cat.desc}</p>
                </div>

                {/* Arrow */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[#333333] text-xs sm:text-sm shadow-sm">
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
