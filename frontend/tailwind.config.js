// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cinema: {
          bg:     '#0f0f0f',
          card:   '#1c1c1c',
          card2:  '#141414',
          border: '#2a2a2a',
          text:   '#e8e8e8',
          muted:  '#888888',
        },
        accent: {
          red:   '#e50914',
          gold:  '#f5c518',
          green: '#00a878',
        },
      },
    },
  },
  plugins: [],
};
