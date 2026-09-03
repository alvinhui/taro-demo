# lite-webpack5-rn

一个纯 React Native 端的多平台示例项目，基于 Taro 4 + React（RN 端使用 Metro）。

仅保留 React Native 端相关的代码与依赖，剔除小程序与 H5，适合用于验证 Taro RN 端兼容性、复现 RN 端相关问题或作为新建纯 RN 项目的最小起点。

## 技术栈

- Taro 4.2.1
- React 18
- TypeScript
- Sass
- Metro（`@tarojs/rn-runner` 驱动，非 Webpack5）
- ESLint + Stylelint
- Husky + Commitlint

## 支持的端

| 端类型 | 构建命令 | 开发命令 |
| --- | --- | --- |
| React Native | `pnpm build:rn` | `pnpm dev:rn` |

## 快速开始

```bash
# 安装依赖（demo 目录位于仓库根 pnpm-workspace 之外，需显式忽略 workspace）
pnpm install --ignore-workspace

# 本地开发（watch 模式，携带二维码联调参数）
pnpm dev:rn

# 构建生产产物
pnpm build:rn
```

### React Native 补充说明

- `dev:rn` 命令会额外携带 `--qr` 参数，启动后终端会打印二维码，可使用 Taro RN 调试 App 扫码联调；`--custom-log-reporter-path` 依赖 `process.stdin.setRawMode`，必须在真实交互式终端（有 TTY）下运行，非交互式 shell（如部分 CI 环境）会因该 API 缺失而报错退出。
- 首次构建时，`@tarojs/rn-supporter` 会在项目根目录自动生成入口文件 `index.js` 与 `metro.config.js`，两者已在 `.gitignore` 中忽略，无需手动创建或提交。
- RN 产物默认输出至 `dist/rn/ios`（`main.jsbundle`）与 `dist/rn/android`（`index.android.bundle`），可结合 Xcode / Android Studio 或 RN CLI 联调；本示例只保留出包/调试所需配置，不包含 android/ios 原生工程目录。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `pnpm build:rn` | 构建 RN 端生产产物到 `dist/rn` |
| `pnpm dev:rn` | 以 watch 模式启动 Metro 开发服务器，并打印联调二维码 |
| `pnpm new` | 使用 Taro generator 新建页面 / 组件等 |

## 目录结构

```text
.
├── config/                 # Taro 构建配置
│   ├── dev.ts              # 开发环境配置
│   ├── index.ts            # 基础配置入口（仅含 rn 段）
│   └── prod.ts             # 生产环境配置
├── src/
│   ├── app.config.ts       # 应用级配置
│   ├── app.scss            # 全局样式（空占位）
│   ├── app.ts              # 应用入口
│   └── pages/              # 页面目录
├── types/                  # 全局类型声明（TARO_ENV 已收窄为 'rn'）
├── package.json            # 脚本与依赖配置
└── tsconfig.json           # TypeScript 配置
```

> `index.js`、`metro.config.js` 为 RN 端构建时自动生成的文件，已被 `.gitignore` 忽略，不体现在版本库中。

## 质量门禁

提交信息通过 Husky `commit-msg` hook 调用 `commitlint` 校验，默认遵循 Conventional Commits，例如：

```bash
git commit -m "feat: add user profile page"
```

> 当前项目尚未内置 `typecheck` / `lint` / `lint:style` 脚本与 `pre-commit` 校验，如需统一质量检查，可参考 [lite-webpack5-h5](../lite-webpack5-h5) 模板补充。
