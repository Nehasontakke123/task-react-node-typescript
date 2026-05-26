/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 24px 80px -40px rgba(15, 23, 42, 0.45)',
      },
      animation: {
        'slow-pulse': 'pulse 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
