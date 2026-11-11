import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    // Bind-mounted volumes on macOS/Windows do not emit native file events.
    watch: process.env.VITE_USE_POLLING ? { usePolling: true } : undefined,
  },
})
