export default function AboutPage() {
  return (
    <div className="min-h-screen bg-pink-50">
      {/* Hero */}
      <section className="bg-hero-gradient py-20 text-center">
        <h1 className="font-display text-5xl font-bold text-pink-800 mb-4">Our Story</h1>
        <p className="text-pink-600 text-lg max-w-xl mx-auto">
          Born from a love of beauty and a belief that every person deserves to feel radiant.
        </p>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="font-display text-3xl font-bold text-pink-700 mb-4">Who We Are</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Glowish Cosmetics was founded with a simple mission: to make premium beauty accessible to
            everyone. We believe that great skincare and makeup should not cost a fortune, nor should
            it compromise on quality.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Each of our products is carefully formulated with skin-loving ingredients — free from
            harmful chemicals and tested by real people with real skin types.
          </p>
          <p className="text-gray-600 leading-relaxed">
            From hydrating serums to long-lasting lip colors, every item in our collection is
            designed to make you feel confident, beautiful, and uniquely you.
          </p>
        </div>

        <div className="text-center">
          <div className="w-64 h-64 mx-auto rounded-full bg-pink-200/60 flex items-center justify-center text-[100px] shadow-lg animate-float">
            🌺
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="section-title">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              { icon: "🌿", title: "Clean Beauty", desc: "No harsh chemicals. Ever. Our formulas are kind to your skin and the planet." },
              { icon: "💖", title: "Inclusive Beauty", desc: "Beauty has no single definition. Our products work for every skin tone and type." },
              { icon: "✨", title: "Quality First", desc: "We source the finest ingredients and test every batch before it reaches you." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="card p-6 text-center">
                <div className="text-5xl mb-3">{icon}</div>
                <h3 className="font-bold text-pink-700 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
