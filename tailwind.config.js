/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // Main teal
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        medical: {
          teal: '#14b8a6',
          blue: '#3b82f6',
          cyan: '#06b6d4',
          lightBlue: '#0ea5e9',
        },
        secondary: {
          50: '#fff5e6',
          100: '#ffebcc',
          200: '#ffd699',
          300: '#ffc266',
          400: '#ffad33',
          500: '#ff9900', // Orange accent
          600: '#cc7a00',
          700: '#995c00',
          800: '#663d00',
          900: '#331f00',
        },
        accent: {
          50: '#ffe6e6',
          100: '#ffcccc',
          200: '#ff9999',
          300: '#ff6666',
          400: '#ff3333',
          500: '#ff0000', // Red accent
          600: '#cc0000',
          700: '#990000',
          800: '#660000',
          900: '#330000',
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Success green
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        warning: {
          50: '#fff9e6',
          100: '#fff2cc',
          200: '#ffe699',
          300: '#ffd966',
          400: '#ffcc33',
          500: '#ffbf00', // Warning yellow
          600: '#cc9900',
          700: '#997300',
          800: '#664d00',
          900: '#332600',
        },
        error: {
          50: '#ffe6e6',
          100: '#ffcccc',
          200: '#ff9999',
          300: '#ff6666',
          400: '#ff3333',
          500: '#ff0000', // Error red
          600: '#cc0000',
          700: '#990000',
          800: '#660000',
          900: '#330000',
        },
        info: {
          50: '#e6f2ff',
          100: '#cce5ff',
          200: '#99cbff',
          300: '#66b2ff',
          400: '#3398ff',
          500: '#007fff', // Info blue
          600: '#0066cc',
          700: '#004c99',
          800: '#003366',
          900: '#001933',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};