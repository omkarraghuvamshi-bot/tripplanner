/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#F0F5F2',
          100: '#DFECE5',
          200: '#BFDACB',
          300: '#98C2AB',
          400: '#6FA487',
          500: '#4D8666',
          600: '#38694E',
          700: '#2A503B',
          800: '#1F3C2C',
          900: '#14271C',
          950: '#0C1811',
        },
        coral: {
          50: '#FFF5F2',
          100: '#FFE6DF',
          200: '#FFCEBF',
          300: '#FFAF99',
          400: '#FF8466',
          500: '#F05A36',
          600: '#DE3F18',
          700: '#B82E0E',
          800: '#93270F',
          900: '#792512',
          950: '#420F05',
        },
        sand: {
          50: '#FDFBF7',
          100: '#F9F5EC',
          200: '#F2E9D6',
          300: '#E8D9BD',
          400: '#DAC29E',
          500: '#C7A77D',
          600: '#B48F65',
          700: '#967451',
          800: '#7B5E43',
          900: '#644D38',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
