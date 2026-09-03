import type { UserConfigExport } from "@tarojs/cli"

export default {
   logger: {
    quiet: false,
    stats: true
  },
  rn: {}
} satisfies UserConfigExport<'webpack5'>
