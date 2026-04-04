/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bark: '#1a1410',
        soil: '#2e2018',
        bronze: '#c17f3b',
        amber: '#e8a84c',
        stone: '#a89880',
        mist: '#d4c5b0',
      },
    },
  },
  plugins: [],
};
