import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Brand palette
        brand: {
          50:  "#f0f0ff",
          100: "#e0e0ff",
          200: "#c4b5fd",
          300: "#a78bfa",
          400: "#8b5cf6",
          500: "#7c3aed",
          600: "#6d28d9",
          700: "#5b21b6",
          800: "#4c1d95",
          900: "#2e1065",
        },
        // Dark background scale
        dark: {
          950: "#04040a",
          900: "#08081a",
          800: "#0d0d24",
          700: "#12122e",
          600: "#18183a",
          500: "#1e1e46",
        },
        // Accent — electric indigo
        accent: {
          DEFAULT: "#7c3aed",
          light:   "#a78bfa",
          glow:    "#6d28d9",
        },
        // Secondary accent — cyan
        cyan: {
          glow: "#06b6d4",
          light: "#67e8f9",
        },
        // Glass surface
        glass: {
          DEFAULT: "rgba(255,255,255,0.05)",
          border:  "rgba(255,255,255,0.1)",
          hover:   "rgba(255,255,255,0.08)",
        },
      },
      fontFamily: {
        sans:    ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "Poppins", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial":  "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":   "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-glow":        "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124,58,237,0.3), transparent)",
        "card-glow":        "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(124,58,237,0.12), transparent)",
        "brand-gradient":   "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)",
        "brand-gradient-r": "linear-gradient(135deg, #06b6d4 0%, #7c3aed 100%)",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "glow-sm":  "0 0 20px rgba(124,58,237,0.2)",
        "glow-md":  "0 0 40px rgba(124,58,237,0.3)",
        "glow-lg":  "0 0 60px rgba(124,58,237,0.4)",
        "glow-xl":  "0 0 100px rgba(124,58,237,0.5)",
        "glass":    "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
        "glass-lg": "0 16px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
      },
      animation: {
        "float":       "float 6s ease-in-out infinite",
        "pulse-glow":  "pulseGlow 3s ease-in-out infinite",
        "shimmer":     "shimmer 2s linear infinite",
        "spin-slow":   "spin 8s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(124,58,237,0.2)" },
          "50%":      { boxShadow: "0 0 60px rgba(124,58,237,0.5)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      transitionDuration: {
        "400": "400ms",
      },
    },
  },
  plugins: [],
};

export default config;
