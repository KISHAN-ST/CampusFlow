/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        apple: {
          blue:    '#0071e3',
          'blue-h': '#0077ed',
          green:   '#30d158',
          red:     '#ff3b30',
          orange:  '#ff9f0a',
          gray:    '#f5f5f7',
          dark:    '#1c1c1e',
          darker:  '#2c2c2e',
        },
      },
      animation: {
        'fade-up':   'fadeUp 0.35s ease-out',
        'fade-in':   'fadeIn 0.25s ease-out',
        'scale-in':  'scaleIn 0.2s ease-out',
        'slide-in':  'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        'card':  '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'modal': '0 24px 60px rgba(0,0,0,0.18)',
      },
    },
  },
  plugins: [],
};
