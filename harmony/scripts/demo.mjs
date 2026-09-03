import { resolve } from 'node:path'

export const harmonyRoot = resolve(import.meta.dirname, '..')
export const repositoryRoot = resolve(harmonyRoot, '..')

const demos = new Set([
  'lite-vite-harmony',
  'lite-webpack5-all',
])

export function resolveDemo(name) {
  if (!demos.has(name)) {
    throw new Error(`Unknown Harmony demo: ${name}`)
  }

  return resolve(repositoryRoot, 'templates', name)
}
