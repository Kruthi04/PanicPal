/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        // Forest Night Theme Colors
        'forest': {
          'bg-1': '#0F1A1A',
          'bg-2': '#152324', 
          'card': '#1C2C2C',
          'text-primary': '#E6F3EE',
          'text-secondary': '#B6C9C3',
          'accent': '#89F0C2',
          'sage': '#A8D5BA',
          'mint': '#7FDBCA',
          'seafoam': '#6BCCC4',
          'lime': '#9AE6B4'
        }
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'dm-sans': ['DM Sans', 'sans-serif']
      },
      borderRadius: {
        'xl': '20px',
        '2xl': '24px'
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.1)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.12)'
      }
    },
  },
  plugins: [],
};
