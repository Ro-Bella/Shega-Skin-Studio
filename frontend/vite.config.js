import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // CRA ነባሪ ፖርት 3000 ስለሆነ እሱን እንጠብቃለን
    open: true,
    // ለዴቨሎፕመንት ጊዜ የ API ጥያቄዎችን ወደ ባክኤንድ ለማስተላለፍ (proxy)
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // የባክኤንድ ሰርቨርዎ አድራሻ
        changeOrigin: true, // CORS ስህተቶችን ለመከላከል ይረዳል
        secure: false,
      },
    },
  },
});