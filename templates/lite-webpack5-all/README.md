# lite-webpack5-all

一个覆盖 Taro 全部支持端的多端示例项目，基于 Taro 4 + React + Webpack5（RN 端使用 Metro，Harmony-CPP 端使用 Vite）。

本项目由 Taro 默认模板生成，保留了小程序、H5、React Native 等各端的完整构建配置，适合用于验证 Taro 多端兼容性、复现多端相关问题或作为新建多端项目的参考。

## 技术栈

- Taro 4.2.1
- React 18
- TypeScript
- Sass
- Webpack5 编译器（小程序 / H5）+ Metro（React Native）+ Vite（Harmony-CPP）
- ESLint + Stylelint
- Husky + Commitlint

## 支持的端

| 端类型 | 构建命令 | 开发命令 |
| --- | --- | --- |
| 微信小程序 | `pnpm build:weapp` | `pnpm dev:weapp` |
| 百度小程序 | `pnpm build:swan` | `pnpm dev:swan` |
| 支付宝小程序 | `pnpm build:alipay` | `pnpm dev:alipay` |
| 字节跳动小程序 | `pnpm build:tt` | `pnpm dev:tt` |
| QQ 小程序 | `pnpm build:qq` | `pnpm dev:qq` |
| 京东小程序 | `pnpm build:jd` | `pnpm dev:jd` |
| H5 | `pnpm build:h5` | `pnpm dev:h5` |
| Harmony-CPP | `pnpm build:harmony` | `pnpm dev:harmony` |
| React Native | `pnpm build:rn` | `pnpm dev:rn` |

## 快速开始

```bash
# 安装依赖
pnpm install --ignore-workspace

# 本地开发（以 H5 为例，其余端将 :h5 替换为对应端标识即可）
pnpm dev:h5

# 构建（以 H5 为例）
pnpm build:h5
```

### React Native 补充说明

- `dev:rn` 命令会额外携带 `--qr` 参数，启动后终端会打印二维码，可使用 Taro RN 调试 App 扫码联调。
- 首次构建 RN 端时，`@tarojs/rn-supporter` 会在项目根目录自动生成入口文件 `index.js` 与 `metro.config.js`，两者已在 `.gitignore` 中忽略，无需手动创建或提交。
- RN 产物默认输出至 `dist/rn/ios`（`main.jsbundle`）与 `dist/rn/android`（`index.android.bundle`），可结合 Xcode / Android Studio 或 RN CLI 联调。

### Harmony-CPP 补充说明

- Harmony-CPP 插件当前仅支持 Vite，因此项目默认编译器仍为 Webpack5，仅 `harmony.compiler` 配置为 `vite`。
- `pnpm build:harmony` 会调用公共 Harmony 脚本选择当前 demo，只生成 Taro Harmony-CPP 产物。
- `pnpm build:hap` 需要在 `build:harmony` 完成后手动执行，用于安装 OpenHarmony 依赖并构建 debug HAP。默认使用 `/Applications/DevEco-Studio.app`，其他路径可通过 `DEVECO_STUDIO_HOME` 指定。
- 调试时使用 DevEco Studio 打开仓库根目录的 `../../harmony/` 并运行 `entry`。`dev:harmony` 会监听 `src/` 与 `config/`，变更后只重新生成 Taro 产物；需要更新 HAP 时再手动执行 `pnpm build:hap`。
- 根目录 `../../harmony/` 由两个 Harmony-CPP demo 共用并保存最近一次生成结果，因此不要并行构建两个 demo。Taro C++ 核心 HAR 在构建时从当前 demo 的插件包复制；HAR、HAP、生成的 ETS、OpenHarmony 依赖和缓存均不会提交到 Git。完整的构建与调试说明见 [`../../harmony/README.md`](../../harmony/README.md)。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `pnpm build:<平台>` | 构建对应端的生产产物到 `dist/` |
| `pnpm dev:<平台>` | 以 watch 模式启动对应端的开发构建 |
| `pnpm new` | 使用 Taro generator 新建页面 / 组件等 |

> `<平台>` 可选值：`weapp`、`swan`、`alipay`、`tt`、`qq`、`jd`、`h5`、`harmony`、`rn`。

## 目录结构

```text
.
├── config/                 # Taro 构建配置
│   ├── dev.ts              # 开发环境配置
│   ├── index.ts            # 基础配置入口（含小程序 / H5 / Harmony / RN 各端配置）
│   └── prod.ts             # 生产环境配置
├── src/
│   ├── app.config.ts       # 应用级配置
│   ├── app.scss            # 全局样式
│   ├── app.ts              # 应用入口
│   ├── index.html          # H5 HTML 模板
│   └── pages/              # 页面目录
├── types/                  # 全局类型声明
├── project.config.json     # 小程序项目配置（微信开发者工具等使用）
├── .env.development        # 开发环境变量（如各端 AppID）
├── .env.production         # 生产环境变量
├── .env.test               # 测试环境变量
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
