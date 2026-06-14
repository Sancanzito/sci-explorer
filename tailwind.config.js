/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // This fixes your Dark Mode issue!
  theme: {
    extend: {
      colors: {
        // Fluorescence-inspired palette
        'fluorescent': {
          cyan: '#00F5FF',
          magenta: '#FF00FF',
          yellow: '#FFFF00',
          blue: '#0066FF',
          green: '#00FF00',
          red: '#FF0066',
        },
        // Dark theme colors
        'dark': {
          bg: '#0A0A0A',
          surface: '#111111',
          elevated: '#1A1A1A',
        },
        // Light theme colors
        'light': {
          bg: '#F8F9FA',
          surface: '#FFFFFF',
          elevated: '#F0F0F0',
        }
      },
      fontFamily: {
        // Scientific-inspired typography
        'display': ['Orbitron', 'system-ui', 'sans-serif'],
        'body': ['IBM Plex Mono', 'monospace'],
        'ui': ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        // Custom animations for spectral lines
        'spectral-pulse': {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '0.8' },
        },
        'electron-excite': {
          '0%': { transform: 'scale(1)', opacity: '0.5' },
          '50%': { transform: 'scale(1.3)', opacity: '0.9' },
          '100%': { transform: 'scale(1)', opacity: '0.5' },
        },
        'orbital-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      animation: {
        'spectral-pulse': 'spectral-pulse 3s ease-in-out infinite',
        'electron-excite': 'electron-excite 2s ease-in-out infinite',
        'orbital-spin': 'orbital-spin 20s linear infinite',
      }
    },
  },
  plugins: [],
}