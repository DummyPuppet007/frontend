import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  server : {
    https: {
      key: fs.readFileSync('/home/bhaumikchauhan/Project/sales-backend/localhost-key.pem'),
      cert: fs.readFileSync('/home/bhaumikchauhan/Project/sales-backend/localhost.pem'),
    },
    // proxy : {
    //   '/api' : 'https://localhost:8081',
    // }
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
