import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        saudi: {
          50: '#e6f4ed',
          100: '#b3dfc8',
          200: '#80cba3',
          300: '#4db67e',
          400: '#26a65f',
          500: '#006c35',
          600: '#005c2d',
          700: '#004d26',
          800: '#003d1e',
          900: '#002e17',
        },
        gold: {
          50: '#fdf8e8',
          100: '#f9ecc0',
          200: '#f3d989',
          300: '#edc44f',
          400: '#e5b535',
          500: '#d4a017',
          600: '#b8860b',
          700: '#966f09',
          800: '#7a5c0e',
          900: '#664d12',
        },
        ink: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#868e96',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        },
        surface: {
          DEFAULT: '#f6faf8',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 44, 34, 0.04)',
        'card': '0 4px 16px rgba(0, 44, 34, 0.06)',
        'elevated': '0 8px 30px rgba(0, 44, 34, 0.08)',
        'float': '0 12px 40px rgba(0, 44, 34, 0.1)',
        'glow': '0 20px 40px rgba(0, 108, 53, 0.15)',
      },
    },
  },
  plugins: [],
};

export default config;
