/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6EDFF',
          100: '#CCDAFF',
          200: '#99B5FF',
          300: '#6690FF',
          400: '#3366FF', // Main primary color
          500: '#0044FF',
          600: '#0036CC',
          700: '#002999',
          800: '#001B66',
          900: '#000E33',
        },
        secondary: {
          50: '#E0FFFC',
          100: '#B3FFF9',
          200: '#80FFF5',
          300: '#4DFFF0',
          400: '#1AFFEC',
          500: '#00ECD8',
          600: '#00B8A9', // Main secondary color
          700: '#008A7F',
          800: '#005C55',
          900: '#002E2B',
        },
        accent: {
          50: '#EEEAFF',
          100: '#D4CAFF',
          200: '#B4A3FF',
          300: '#937CFF',
          400: '#6B48FF', // Main accent color
          500: '#5330F5',
          600: '#3F1DD9',
          700: '#2D15A8',
          800: '#1D0C78',
          900: '#0F0647',
        },
        success: {
          50: '#E5F9E7',
          100: '#C2F0C8',
          200: '#9AE6A5',
          300: '#71DB82',
          400: '#4ACE5F',
          500: '#28A745', // Main success color
          600: '#208538',
          700: '#18642A',
          800: '#10421C',
          900: '#08210E',
        },
        warning: {
          50: '#FFF9E6',
          100: '#FFEFC0',
          200: '#FFE699',
          300: '#FFDC73',
          400: '#FFD34D',
          500: '#FFC107', // Main warning color
          600: '#CC9A06',
          700: '#997404',
          800: '#664D03',
          900: '#332701',
        },
        error: {
          50: '#FCEBEA',
          100: '#F8CCC9',
          200: '#F3ADA8',
          300: '#EE8D87',
          400: '#E96E66',
          500: '#DC3545', // Main error color
          600: '#B02A37',
          700: '#842029',
          800: '#58151C',
          900: '#2C0B0E',
        },
        neutral: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 25px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.12)',
        'button': '0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};