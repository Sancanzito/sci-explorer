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
    '/api/stats': { target: 'http://localhost:8000', changeOrigin: true },
    '/api/gemini': { target: 'http://localhost:8000', changeOrigin: true },  // ← add this
  },
},
  optimizeDeps: {
    include: ['plotly.js-dist-min', 'react-plotly.js'],
    exclude: ['plotly.js', 'src/components/graph/backend/**/*'],
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
        manualChunks: (id) => {
          if (id.includes('plotly.js-dist-min')) {
            return 'plotly';
          }
          // Optionally, you can add more chunk splitting rules here
          // if (id.includes('node_modules/react')) return 'vendor';
          if (id.includes('node_modules')) {
            return 'vendor';
          }
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