"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const WORDS = ["Glow.", "Bloom.", "Shine.", "Radiate.", "Flourish."];

export function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % WORDS.length);
        setVisible(true);
      }, 400);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#fff0f5]">
      {/* Decorative blobs */}
      <div className="absolute -top-32 -right-32 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] rounded-full bg-pink-200/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-24 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] rounded-full bg-pink-300/30 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full bg-rose-100/40 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-10 min-h-screen flex flex-col justify-center">
        {/* Top label */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8 animate-fade-in">
          <div className="h-px w-8 sm:w-10 bg-pink-400" />
          <span className="text-pink-500 tracking-[0.2em] sm:tracking-[0.3em] uppercase text-xs font-semibold">
            New Collection 2025
          </span>
        </div>

        {/* Main headline */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left: text */}
          <div>
            <h1 className="font-display text-[clamp(2.4rem,9vw,7rem)] font-bold leading-[0.92] tracking-tight text-pink-900 mb-6 sm:mb-8">
              Beauty<br />
              Made to{" "}
              <span
                className="italic text-pink-500 transition-all duration-400"
                style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", display: "inline-block" }}
              >
                {WORDS[wordIndex]}
              </span>
            </h1>

            <p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-sm mb-8 sm:mb-10">
              Handcrafted cosmetics for every skin tone. Clean formulas, stunning results — because you deserve both.
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
              <Link
                href="/shop"
                className="group relative overflow-hidden bg-pink-500 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm tracking-wide transition-all duration-300 hover:shadow-xl hover:shadow-pink-300/50 hover:-translate-y-0.5"
              >
                <span className="relative z-10">Explore Collection</span>
                <div className="absolute inset-0 bg-pink-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
              <Link
                href="/about"
                className="text-pink-600 font-semibold text-sm flex items-center gap-2 hover:gap-3 transition-all"
              >
                Our Story <span className="text-base sm:text-lg">→</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 sm:gap-8 mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-pink-100">
              {[["2K+", "Happy Customers"], ["150+", "Products"], ["100%", "Clean Formula"]].map(([n, l]) => (
                <div key={l}>
                  <p className="font-display text-xl sm:text-2xl font-bold text-pink-600">{n}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: visual — hidden on mobile */}
          <div className="relative h-[520px] hidden lg:block">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-br from-pink-200 to-rose-300 shadow-2xl shadow-pink-300/40 animate-float flex items-center justify-center text-[140px]">
              🌸
            </div>
            <FloatingPill className="top-10 right-10" delay="0s" emoji="✨" label="Vitamin C Serum" />
            <FloatingPill className="bottom-20 left-0" delay="0.6s" emoji="💄" label="Velvet Lip Color" />
            <FloatingPill className="top-1/2 -right-4" delay="1.2s" emoji="🌺" label="Rose Toner" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-pink-200/60 animate-spin" style={{ animationDuration: "20s" }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] rounded-full border border-pink-100/40 animate-spin" style={{ animationDuration: "30s", animationDirection: "reverse" }} />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-pink-300 animate-bounce">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-pink-300 to-transparent" />
      </div>
    </section>
  );
}

function FloatingPill({ className, delay, emoji, label }: { className: string; delay: string; emoji: string; label: string }) {
  return (
    <div
      className={`absolute ${className} bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-pink-100 px-4 py-3 flex items-center gap-3 animate-float`}
      style={{ animationDelay: delay }}
    >
      <span className="text-2xl">{emoji}</span>
      <span className="text-xs font-semibold text-pink-700 whitespace-nowrap">{label}</span>
    </div>
  );
}
