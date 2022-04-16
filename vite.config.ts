import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  server: {
    proxy: {
      '/tiles': {
        target: 'https://pl3x.freeserver.pro/',
        changeOrigin: true
      },
    }
  }
})
