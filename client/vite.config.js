import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Determine backend target for the dev proxy. If the server has written a
// `.port` file (the Express server writes this at startup), use that port so
// the frontend dev server proxies to the actual backend port the server chose.
const defaultBackend = 'http://localhost:5000'
let backendTarget = defaultBackend
try {
  const portFile = path.join(process.cwd(), '..', 'server', '.port')
  console.log('Vite config: checking port file at', portFile)
  if (fs.existsSync(portFile)) {
    const p = fs.readFileSync(portFile, 'utf8').trim()
    console.log('Vite config: found port file with content:', p)
    if (p) backendTarget = `http://localhost:${p}`
  } else {
    console.log('Vite config: port file does not exist')
  }
  console.log('Vite config: using backend target:', backendTarget)
} catch (err) {
  console.warn('vite.config: could not read server/.port, using default backend', err.message)
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: backendTarget,
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
