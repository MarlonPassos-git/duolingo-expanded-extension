import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import manifest from './manifest.config';

export default defineConfig({
  plugins: [
    crx({ manifest }),
    react(),
  ],
  server: {
    port: 3322,
  },
});
