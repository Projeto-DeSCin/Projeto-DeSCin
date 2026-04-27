/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        violet: {
          50: '#F5F3FF',
          100: '#EDE9FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          900: '#3B0764',
        },
        amber: {
          100: '#FEF3C7',
          400: '#FCD34D',
          500: '#F59E0B',
        },
        surface: '#F8F7FF',
        card: '#F1EFFE',
        'card-border': '#E5E1F8',
        'card-hover': '#EDE9FD',
        success: '#10B981',
        danger: '#EF4444',
        ink: '#0A0A0F',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(124, 58, 237, 0.06)',
        'card-hover': '0 8px 40px rgba(124, 58, 237, 0.14)',
      },
      borderRadius: {
        card: '12px',
        input: '8px',
        tag: '6px',
      },
    },
  },
  plugins: [],
};
