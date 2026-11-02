import process from 'node:process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves the app under /nba-programm/ (set VITE_BASE in the workflow); default '/' for Firebase/dev
  base: process.env.VITE_BASE || '/',
})
