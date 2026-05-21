import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#171717",
        paper: "#f8f7f2",
        graphite: "#222326",
        matcha: "#74a56f",
        limewash: "#dcefc8",
        coral: "#ef786f",
        saffron: "#e6ad4b",
        lagoon: "#55b7be",
        berry: "#a767aa"
      },
      boxShadow: {
        glow: "0 20px 70px rgba(85, 183, 190, 0.18)",
        soft: "0 18px 45px rgba(23, 23, 23, 0.08)"
      },
      animation: {
        "fade-in": "fade-in 420ms ease-out",
        "slide-up": "slide-up 380ms ease-out",
        pulseSlow: "pulse 2.8s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
