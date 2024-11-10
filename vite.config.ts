import { crx } from '@crxjs/vite-plugin'
import { defineConfig } from 'vite'
import manifest from './manifest.config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    crx({ manifest }),
    react(),
  ],
  server: {
    port: 3355,
    host: '0.0.0.0',
  },
})
