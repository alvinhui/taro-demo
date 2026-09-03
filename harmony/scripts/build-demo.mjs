import { spawnSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, rmSync, unlinkSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { harmonyRoot, resolveDemo } from './demo.mjs'

const demoName = process.argv[2]
const demoRoot = resolveDemo(demoName)
const taro = resolve(demoRoot, 'node_modules/@tarojs/cli/bin/taro')
const harmonyLibrary = resolve(demoRoot, 'node_modules/@tarojs/plugin-platform-harmony-cpp/static/@taro-oh/library-4.2.1.har')
const harmonyStatic = resolve(harmonyRoot, 'static/@taro-oh')
const activeDemoFile = resolve(harmonyRoot, '.active-demo')

for (const file of [taro, harmonyLibrary]) {
  if (!existsSync(file)) {
    throw new Error(`Required dependency not found: ${file}. Run pnpm install in ${demoRoot}.`)
  }
}

for (const generatedPath of [
  resolve(harmonyRoot, 'entry/build'),
  resolve(harmonyRoot, 'entry/src/main/ets'),
  resolve(harmonyRoot, 'entry/src/main/resources/rawfile'),
]) {
  if (existsSync(generatedPath)) rmSync(generatedPath, { recursive: true })
}
if (existsSync(activeDemoFile)) unlinkSync(activeDemoFile)

mkdirSync(harmonyStatic, { recursive: true })
copyFileSync(harmonyLibrary, resolve(harmonyStatic, 'library-4.2.1.har'))

const result = spawnSync(process.execPath, [taro, 'build', '--type', 'harmony_cpp'], {
  cwd: demoRoot,
  stdio: 'inherit',
})
if (result.error) throw result.error
if (result.status !== 0) process.exit(result.status ?? 1)

writeFileSync(activeDemoFile, `${demoName}\n`)
console.log(`[harmony] Active demo: ${demoName}`)
