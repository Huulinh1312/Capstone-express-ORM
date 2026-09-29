/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#222321',
        paper: '#fbfaf7',
        coral: '#ed4b3f',
        sage: '#dce6d9',
        cream: '#f3efe7',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        soft: '0 18px 55px rgba(34, 35, 33, .11)',
      },
    },
  },
  plugins: [],
};
