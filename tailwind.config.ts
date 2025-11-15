import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'radianza-gold': '#D4AF37',
        'radianza-light-gold': '#F4E4C1',
        'radianza-deep-blue': '#1a237e',
        'radianza-sky-blue': '#4fc3f7',
        'radianza-celestial': '#e3f2fd',
        'radianza-white': '#ffffff',
        'radianza-dark': '#0d1b2a',
      },
    },
  },
  plugins: [],
} satisfies Config;
