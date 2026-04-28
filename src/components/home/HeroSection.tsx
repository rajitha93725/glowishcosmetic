"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const SLIDES = [
  {
    id: 1,
    image: "/images/carousel/slide1.png",
    title: "Luminosité Essentials",
    subtitle: "Radiance redefined.",
    cta: "Shop the Collection"
  },
  {
    id: 2,
    image: "/images/carousel/slide2.png",
    title: "Illuminating Face Serum",
    subtitle: "Glow from within.",
    cta: "Discover Serum"
  },
  {
    id: 3,
    image: "/images/carousel/slide3.png",
    title: "Premium Artistry",
    subtitle: "The ultimate makeup wardrobe.",
    cta: "Explore Makeup"
  }
];

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  return (
    <section className="relative w-full h-[80vh] min-h-[600px] overflow-hidden bg-[#fff0f5]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image
            src={SLIDES[currentIndex].image}
            alt={SLIDES[currentIndex].title}
            fill
            className="object-cover object-center"
            priority
          />
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl"
          >
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-normal tracking-wider text-white mb-4 drop-shadow-md">
              {SLIDES[currentIndex].title}
            </h1>
            <p className="text-lg sm:text-xl font-light tracking-wide text-white/90 mb-8 drop-shadow">
              {SLIDES[currentIndex].subtitle}
            </p>
            <Link
              href="/shop"
              className="inline-block bg-white text-[#333333] hover:bg-gray-100 font-normal tracking-widest uppercase text-sm px-8 py-4 rounded-none transition-all shadow-sm hover:shadow active:scale-95"
            >
              {SLIDES[currentIndex].cta}
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all z-20"
        aria-label="Previous Slide"
      >
        <FiChevronLeft size={24} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all z-20"
        aria-label="Next Slide"
      >
        <FiChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              idx === currentIndex ? "bg-white w-8" : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
