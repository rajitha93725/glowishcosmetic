import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50:  "#fff0f5",
          100: "#ffe4ee",
          200: "#ffc0cb",
          300: "#ff94b0",
          400: "#ff69b4",
          500: "#ff4da6",
          600: "#e6007a",
          700: "#b3005f",
          800: "#800044",
          900: "#4d0029",
        },
        blush: "#fce4ec",
        rose:  "#f48fb1",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-playfair)", "serif"],
      },
      backgroundImage: {
        "pink-gradient":
          "linear-gradient(135deg, #fff0f5 0%, #ffc0cb 50%, #ff69b4 100%)",
        "hero-gradient":
          "linear-gradient(135deg, #ffe4ee 0%, #ffc0cb 100%)",
      },
      animation: {
        "fade-in":  "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "float":    "float 3s ease-in-out infinite",
        "marquee":  "marquee 28s linear infinite",
        "spin":     "spin 20s linear infinite",
      },
      keyframes: {
        fadeIn:  { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { transform: "translateY(20px)", opacity: "0" }, "100%": { transform: "translateY(0)", opacity: "1" } },
        float:   { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
      },
    },
  },
  plugins: [],
};
export default config;
