import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// The dashboard (and its heavy recharts dependency) is lazy-loaded in App.tsx,
// so Vite automatically splits it into a separate chunk — the login / initial
// payload stays small and loads fast.
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
  },
})
