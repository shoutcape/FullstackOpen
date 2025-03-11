import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const TEST_PORT = process.env.TEST_PORT
const PORT = process.env.PORT

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${PORT || TEST_PORT}`,
        changeOrigin: true,
      },
    },
    host: true,
    watch: {
      usePolling: true,
    }
  }
})
