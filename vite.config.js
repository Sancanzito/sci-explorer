// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  base: './', // Change to relative path or keep as '/' if using a custom domain
  build: {
    outDir: 'dist',
  }
})