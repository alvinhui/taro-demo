import path from 'node:path'

import { defineConfig, type UserConfigExport } from '@tarojs/cli'

export default defineConfig<'vite'>({
  projectName: 'lite-vite-harmony',
  date: '2026-09-02',
  designWidth: 750,
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: ['@tarojs/plugin-platform-harmony-cpp'],
  framework: 'react',
  compiler: 'vite',
  harmony: {
    projectPath: path.resolve(__dirname, '../../../harmony'),
    hapName: 'entry',
    name: 'entry',
  },
} satisfies UserConfigExport<'vite'>)
