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
        primary: {
          50: '#e8f0f8',
          100: '#c5d8ed',
          200: '#9ebfe0',
          300: '#78a5d3',
          400: '#5b92c9',
          500: '#3f7fbf',
          600: '#326499',
          700: '#264d77',
          800: '#1a3655',
          900: '#0f2440',
          950: '#09162b',
        },
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
        accent: {
          50: '#f9f5ee',
          100: '#efe5d4',
          200: '#e4d5b9',
          300: '#d9c49f',
          400: '#cfb485',
          500: '#c9a96e',
          600: '#b8975a',
          700: '#a78546',
          800: '#967332',
          900: '#85611e',
        },
        surface: {
          50: '#fafbfc',
          100: '#f5f6f8',
          200: '#eef0f3',
          300: '#e2e5e9',
          400: '#c8cdd4',
          500: '#9ba3af',
          600: '#6b7280',
          700: '#4b5563',
          800: '#374151',
          900: '#1f2937',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(15, 36, 43, 0.04)',
        'card': '0 4px 24px rgba(15, 36, 43, 0.06)',
        'card-hover': '0 8px 40px rgba(15, 36, 43, 0.1)',
        'elevated': '0 12px 48px rgba(15, 36, 43, 0.12)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
