import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-emerald': '#0f5f3e',
        'brand-gold': '#b89a61',
        'brand-slate': '#0b1219',
        'brand-card': 'rgba(12, 18, 25, 0.72)',
        'brand-glass': 'rgba(255, 255, 255, 0.08)',
        'brand-glow': 'rgba(184, 154, 97, 0.2)'
      },
      boxShadow: {
        glow: '0 20px 120px rgba(184, 154, 97, 0.18)',
        glass: '0 12px 40px rgba(0,0,0,0.18)'
      },
      backgroundImage: {
        'hero-pattern': 'radial-gradient(circle at top left, rgba(184,154,97,0.22), transparent 24%), radial-gradient(circle at bottom right, rgba(15,95,62,0.18), transparent 30%)'
      }
    }
  },
  plugins: []
};

export default config;
