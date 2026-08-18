import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The workspace packages are unbuilt ESM reached through a pnpm symlink in
  // node_modules. Left to itself Vite ignores node_modules when watching and
  // pre-bundles what it finds there, so an edit to @tmg180/shared would not
  // reach the browser until the dev server was restarted — which looks exactly
  // like "module does not provide an export named X".
  optimizeDeps: {
    exclude: ['@tmg180/shared', '@tmg180/terminology'],
  },
  server: {
    port: 5173,
    watch: {
      // Follow the symlink and un-ignore our own packages inside node_modules.
      followSymlinks: true,
      ignored: ['!**/node_modules/@tmg180/**'],
    },
    // Same-origin /api in dev so the browser never needs a CORS preflight and
    // VITE_API_URL can stay unset locally.
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY ?? 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
