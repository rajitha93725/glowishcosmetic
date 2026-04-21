import Link from "next/link";

const CATEGORIES = [
  {
    label: "Skincare",
    tag: "skincare",
    emoji: "✨",
    desc: "Serums, moisturizers & more",
    bg: "from-pink-50 to-rose-100",
    accent: "bg-pink-200",
  },
  {
    label: "Makeup",
    tag: "makeup",
    emoji: "💄",
    desc: "Lips, eyes, face",
    bg: "from-rose-50 to-pink-100",
    accent: "bg-rose-200",
  },
  {
    label: "Fragrance",
    tag: "fragrance",
    emoji: "🌺",
    desc: "Perfumes & mists",
    bg: "from-pink-100 to-fuchsia-100",
    accent: "bg-pink-300",
  },
  {
    label: "Hair Care",
    tag: "haircare",
    emoji: "💆",
    desc: "Oils, masks & treatments",
    bg: "from-fuchsia-50 to-pink-100",
    accent: "bg-fuchsia-200",
  },
];

export function CategorySection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-pink-400 tracking-widest uppercase text-xs font-semibold mb-2">Categories</p>
            <h2 className="font-display text-4xl font-bold text-pink-900">Shop by Ritual</h2>
          </div>
          <Link href="/shop" className="hidden sm:flex items-center gap-2 text-pink-500 font-semibold text-sm hover:gap-3 transition-all">
            View All <span>→</span>
          </Link>
        </div>

        {/* Grid — first card is tall */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.tag}
              href={`/shop?tag=${cat.tag}`}
              className={`group relative rounded-3xl bg-gradient-to-br ${cat.bg} overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-200/50 ${i === 0 ? "row-span-2 lg:row-span-1" : ""}`}
            >
              <div className={`p-6 flex flex-col h-full min-h-[160px] ${i === 0 ? "min-h-[340px] lg:min-h-[160px]" : ""}`}>
                {/* Emoji bubble */}
                <div className={`w-14 h-14 ${cat.accent} rounded-2xl flex items-center justify-center text-3xl mb-auto group-hover:scale-110 transition-transform duration-300`}>
                  {cat.emoji}
                </div>

                <div className="mt-8">
                  <h3 className="font-display font-bold text-pink-800 text-xl mb-1">{cat.label}</h3>
                  <p className="text-pink-500/70 text-sm">{cat.desc}</p>
                </div>

                {/* Arrow */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-pink-500 text-sm">
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
