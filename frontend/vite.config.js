import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // Dış bağlantılara izin verir
    port: 5173,  // Portu belirtiyoruz (zaten varsayılan olarak 5173 kullanılıyor)
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    watch: {
      usePolling: true,  // Docker üzerinde dosya izlemeyi etkinleştirir
    }
  }
})
