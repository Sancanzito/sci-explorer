import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cesium from 'vite-plugin-cesium'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    cesium(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', '**/*.wasm'],
      manifest: {
        name: 'Sci-Explorer',
        short_name: 'SciExplorer',
        description: 'Interactive Science Learning Platform',
        theme_color: '#121a24',
        background_color: '#121a24',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'favicon.ico',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,wasm,gltf,b3dm,glb}'],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
      }
    })
  ],
  define: {
    global: 'globalThis',
  },
  base: './',
  server: {
    proxy: {
      '/api/stats': { target: 'http://localhost:8000', changeOrigin: true },
      '/api/gemini': { target: 'http://localhost:8000', changeOrigin: true },
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