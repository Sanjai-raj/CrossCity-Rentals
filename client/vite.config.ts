import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'mongodb+srv://carRental:12345@carrental.vbz3jkc.mongodb.net/carRental?retryWrites=true&w=majority',
        changeOrigin: true,
      },
    },
  },
})