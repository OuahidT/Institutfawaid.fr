import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        fawaid: {
          bg: '#FCFBF8',
          surface: '#F5F1E8',
          text: '#171717',
          muted: '#5B5B5B',
          accent: '#044BAD',
          accent2: '#2F69C4',
          accentSoft: '#EAF1FF',
          border: '#DEE6F4',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        heading: ['var(--font-manrope)', 'sans-serif'],
        arabic: ['var(--font-noto-arabic)', 'serif'],
      },
      boxShadow: {
        soft: '0 12px 28px rgba(23, 23, 23, 0.06)',
        card: '0 8px 20px rgba(4, 75, 173, 0.1)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 700ms ease both',
      },
    },
  },
  plugins: [],
};

export default config;
