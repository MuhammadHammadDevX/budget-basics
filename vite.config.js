import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base: './' lets the built site (dist/) run from any folder or static host.
export default defineConfig({
  base: './',
  plugins: [react()],
})
