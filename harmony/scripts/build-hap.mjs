import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { delimiter, resolve } from 'node:path'

import { harmonyRoot } from './demo.mjs'

const devecoRoot = process.env.DEVECO_STUDIO_HOME || '/Applications/DevEco-Studio.app/Contents'
const tools = resolve(devecoRoot, 'tools')
const ohpm = process.env.OHPM_BIN || resolve(tools, 'ohpm/bin/ohpm')
const hvigor = process.env.HVIGOR_BIN || resolve(tools, 'hvigor/bin/hvigorw')
const javaHome = process.env.JAVA_HOME || resolve(devecoRoot, 'jbr/Contents/Home')
const sdkHome = process.env.DEVECO_SDK_HOME || resolve(devecoRoot, 'sdk')
const activeDemoFile = resolve(harmonyRoot, '.active-demo')
const appFile = resolve(harmonyRoot, 'entry/src/main/ets/app.ets')

function run(command, args, cwd = harmonyRoot, env = process.env) {
  const result = spawnSync(command, args, { cwd, env, stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}

if (!existsSync(activeDemoFile) || !existsSync(appFile)) {
  throw new Error('Harmony-CPP output not found. Run `pnpm build:vite` or `pnpm build:webpack5` first.')
}

const activeDemo = readFileSync(activeDemoFile, 'utf8').trim()
console.log(`[harmony] Building HAP for ${activeDemo}`)

const appSource = readFileSync(appFile, 'utf8')
const patchedSource = appSource.replace('let levelRes: number', 'let levelRes: number = 0')
if (patchedSource === appSource && !appSource.includes('let levelRes: number = 0')) {
  throw new Error(`Unable to apply the DevEco 26 compatibility fix to ${appFile}`)
}
writeFileSync(appFile, patchedSource)

for (const executable of [ohpm, hvigor]) {
  if (!existsSync(executable)) {
    throw new Error(`DevEco Studio tool not found: ${executable}`)
  }
}

const env = {
  ...process.env,
  JAVA_HOME: javaHome,
  DEVECO_SDK_HOME: sdkHome,
  PATH: [resolve(javaHome, 'bin'), process.env.PATH].filter(Boolean).join(delimiter),
}

run(ohpm, ['install'], harmonyRoot, env)
run(hvigor, [
  '--mode', 'module',
  '-p', 'product=default',
  '-p', 'module=entry@default',
  '-p', 'buildMode=debug',
  'assembleHap',
  '--no-daemon',
], harmonyRoot, env)
