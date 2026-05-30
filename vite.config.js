// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  base: './',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // Add this to fix the backend scanning issue
  optimizeDeps: {
    include: ['plotly.js-dist-min', 'react-plotly.js'],
    exclude: ['plotly.js', 'src/components/graph/backend/**/*'],
    // Force Vite to only scan these entries
    entries: ['src/main.jsx', 'src/**/*.jsx', 'src/**/*.js', 'src/**/*.tsx', 'src/**/*.ts']
  },
  build: {
    outDir: 'dist',
    commonjsOptions: {
      include: [/plotly.js-dist-min/, /node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      input: {
        main: 'index.html'
      },
      output: {
        manualChunks: {
          plotly: ['plotly.js-dist-min'],
        },
      },
    },
  },
  resolve: {
    alias: {
      'plotly.js': 'plotly.js-dist-min',
    },
    dedupe: [
      'react', 
      'react-dom', 
      '@wendellhu/redi', 
      'clsx'
    ],
  },
})