import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'paper':            '#F7F2EA',
        'cream':            '#EFE8DC',
        'ink':              '#1C1917',
        'vermillion':       '#C0392B',
        'vermillion-dark':  '#922B21',
        'vermillion-mid':   '#A83226',
        'vermillion-light': '#E8967A',
        'gold':             '#FFD500',
        'gold-soft':        '#FFE566',
        'muted':            '#7C7570',
        'line':             '#DDD5C6',
        'bg-page':          '#F7F2EA',
        'bg-soft':          '#EFE8DC',
      },
      fontFamily: {
        outfit: ['Outfit', 'system-ui', '-apple-system', 'sans-serif'],
        inter: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
}

export default config
