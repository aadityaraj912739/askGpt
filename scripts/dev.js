#!/usr/bin/env node
// Simple dev orchestrator for Windows/macOS/Linux
// Behavior:
// - If server/.port exists, it assumes backend already started and will only start client
// - Otherwise, it starts `npm run dev` in the server folder and waits for server/.port
// - After port is available, it starts client with `npm run dev`

import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')
const serverDir = path.join(root, 'server')
const clientDir = path.join(root, 'client')
const portFile = path.join(serverDir, '.port')

const waitForPortFile = (timeoutSec = 15) => {
  return new Promise((resolve, reject) => {
    const start = Date.now()
    const check = () => {
      if (fs.existsSync(portFile)) {
        const p = fs.readFileSync(portFile, 'utf8').trim()
        return resolve(p)
      }
      if ((Date.now() - start) / 1000 > timeoutSec) return reject(new Error('Timed out waiting for server/.port'))
      setTimeout(check, 500)
    }
    check()
  })
}

const run = (cmd, args, opts = {}) => {
  const proc = spawn(cmd, args, { shell: true, stdio: 'inherit', ...opts })
  proc.on('exit', (code) => {
    if (code !== 0) console.warn(`${cmd} ${args.join(' ')} exited with code ${code}`)
  })
  return proc
}

const main = async () => {
  try {
    if (fs.existsSync(portFile)) {
      const p = fs.readFileSync(portFile, 'utf8').trim()
      console.log(`Detected existing backend port: ${p}`)
      console.log('Starting client only...')
      run('npm', ['run', 'dev'], { cwd: clientDir })
      return
    }

    console.log('Starting backend...')
    // Use npm run dev in server; nodemon will restart on changes
    run('npm', ['run', 'dev'], { cwd: serverDir })

    console.log('Waiting for backend to write server/.port...')
    const port = await waitForPortFile(20)
    console.log(`Backend is up on port ${port}. Starting client...`)

    run('npm', ['run', 'dev'], { cwd: clientDir })
  } catch (err) {
    console.error('Dev orchestrator error:', err.message)
    process.exit(1)
  }
}

main()
