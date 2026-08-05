/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        industrial: {
          bg: '#0a0a0a',
          surface: '#111111',
          card: '#161616',
          border: '#2a2a2a',
          accent: '#f97316',
          'accent-dim': '#c2560d',
          muted: '#6b7280',
          text: '#e5e7eb',
          heading: '#f9fafb',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

