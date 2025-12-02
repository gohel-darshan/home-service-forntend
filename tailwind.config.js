/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      colors: {
        primary: {
          DEFAULT: '#2A55E5', // Royal Blue
          hover: '#1e40b0',
          light: '#E8EEFF'
        },
        secondary: {
          DEFAULT: '#22C55E', // Emerald Green
          hover: '#16a34a',
          light: '#DCFCE7'
        },
        background: '#F7F7F7', // Off-white
        surface: '#FFFFFF',
        text: {
          DEFAULT: '#1A1A1A', // Deep Gray
          muted: '#6B7280',
          light: '#9CA3AF'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [],
}
