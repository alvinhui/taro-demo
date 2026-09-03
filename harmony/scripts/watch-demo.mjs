import { spawn } from 'node:child_process'
import { watch } from 'node:fs'
import { resolve } from 'node:path'

import { resolveDemo } from './demo.mjs'

const demoName = process.argv[2]
const demoRoot = resolveDemo(demoName)
const watchRoots = ['src', 'config']
const watchers = []
let buildProcess
let rebuildPending = false
let debounceTimer

function runBuild() {
  if (buildProcess) {
    rebuildPending = true
    return
  }

  console.log(`[harmony] Generating ${demoName}...`)
  buildProcess = spawn(process.execPath, [resolve(import.meta.dirname, 'build-demo.mjs'), demoName], {
    stdio: 'inherit',
  })
  buildProcess.once('exit', (code, signal) => {
    buildProcess = undefined
    if (signal) {
      console.log(`[harmony] Build stopped by ${signal}.`)
    } else if (code === 0) {
      console.log('[harmony] Taro output generated. Watching for changes...')
    } else {
      console.error(`[harmony] Taro generation failed with exit code ${code}. Watching for changes...`)
    }

    if (rebuildPending) {
      rebuildPending = false
      runBuild()
    }
  })
}

for (const root of watchRoots) {
  watchers.push(watch(resolve(demoRoot, root), { recursive: true }, () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(runBuild, 100)
  }))
}

function shutdown() {
  clearTimeout(debounceTimer)
  watchers.forEach(watcher => watcher.close())
  buildProcess?.kill('SIGTERM')
}

process.once('SIGINT', shutdown)
process.once('SIGTERM', shutdown)

runBuild()
