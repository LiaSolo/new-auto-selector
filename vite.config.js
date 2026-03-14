import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use '/src/scss/globals' as *;`,
      }
    }
  },
  plugins: [react()],
  server: {
    port: 3001,
    host: true
  }
})
