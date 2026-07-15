import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Deployed at https://texoma-masjid.github.io (org user-page repo named
  // "texoma-masjid.github.io"), so the site serves from the domain root.
  base: '/',
})
