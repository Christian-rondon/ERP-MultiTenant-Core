/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'deep-layers': '#020617',
        'cobalt-blue': '#1e3a8a',
        'electric-cyan': '#00f2ff',
        'neon-emerald': '#00ff88',
        'silver-gray': '#94a3b8',
        'amber-glow': '#ff6b35',
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #020617 0%, #1e3a8a 100%)',
      },
    },
  },
  plugins: [],
}
