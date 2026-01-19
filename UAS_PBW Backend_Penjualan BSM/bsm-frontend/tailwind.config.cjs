/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bsm: {
          bg: '#0f1512',
          panel: '#121a16',
          card: '#162118',
          accent: '#2e7d32',
          accent2: '#46a049',
          border: '#223227',
          muted: '#9bb0a3',
        },
      },
    },
  },
  plugins: [],
};
