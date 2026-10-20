import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './hooks/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#05070d',
          900: '#080c16',
          800: '#0a1a3a',
          700: '#10264f',
        },
        brand: {
          blue: '#1e6bff',
          sky: '#00b4ff',
          navy: '#0a1a3a',
          ice: '#9fd8ff',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        brand: ['var(--font-display)', 'sans-serif'],
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'scroll-dot': {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '30%': { opacity: '1' },
          '100%': { transform: 'translateY(12px)', opacity: '0' },
        },
        'loader-line': {
          '0%': { transform: 'scaleX(0)', transformOrigin: 'left' },
          '50%': { transform: 'scaleX(1)', transformOrigin: 'left' },
          '50.1%': { transformOrigin: 'right' },
          '100%': { transform: 'scaleX(0)', transformOrigin: 'right' },
        },
      },
      animation: {
        'scroll-dot': 'scroll-dot 1.8s cubic-bezier(0.16, 1, 0.3, 1) infinite',
        'loader-line': 'loader-line 1.6s cubic-bezier(0.76, 0, 0.24, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
