import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port : 3000, 
    proxy: {
      '/api/': {
        target: 'http://localhost:8000', // Your backend server
        changeOrigin: true, // Change the origin header to match the target
        secure: false, // Set to false if your backend uses self-signed SSL
      },
    },
  },
});
