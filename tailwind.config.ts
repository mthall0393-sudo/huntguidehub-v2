/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        bark: '#1a1410', // Primary dark color
        soil: '#2e2018',
        bronze: '#c17f3b', // Accent color 1
        amber: '#e8a84c',  // Accent color 2
        stone: '#a89880',
        mist: '#d4c5b0',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "var(--radius)",
        sm: "var(--radius)",
      },
      fontFamily: {
        sans: ["Oswald", "sans-serif"], // Oswald for headings
        serif: ["Source Serif 4", "serif"], // Source Serif 4 for body text
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
