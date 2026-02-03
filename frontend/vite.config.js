import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // CRA ነባሪ ፖርት 3000 ስለሆነ እሱን እንጠብቃለን
    open: true,
  },
});