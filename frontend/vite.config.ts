import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import path from 'path'

// Manually load .env file
dotenv.config({ path: path.resolve(__dirname, '.env') })

// const serverUrl = process.env.VITE_SERVERURL || 'http://localhost:3004';

export default defineConfig({
  plugins: [react()],
  server: {
   proxy: {
      "/api": 'http://localhost:3004',
    },
  },
   build: {
    chunkSizeWarningLimit: 1000
  }
})
