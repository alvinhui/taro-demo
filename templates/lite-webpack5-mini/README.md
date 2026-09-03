# lite-webpack5-mini

一个纯小程序端的多平台示例项目，基于 Taro 4 + React + Webpack5。

仅保留 6 个小程序端（微信 / 百度 / 支付宝 / 字节 / QQ / 京东）相关的代码与依赖，剔除 H5 与 React Native，适合用于验证小程序多端兼容性、复现小程序端相关问题或作为新建纯小程序项目的最小起点。

## 技术栈

- Taro 4.2.1
- React 18
- TypeScript
- Sass
- Webpack5 编译器（`@tarojs/webpack5-runner`）
- ESLint + Stylelint
- Husky + Commitlint

## 支持的端

| 端类型 | 构建命令 | 开发命令 | IDE 配置文件 |
| --- | --- | --- | --- |
| 微信小程序 | `pnpm build:weapp` | `pnpm dev:weapp` | `project.config.json` |
| 百度小程序 | `pnpm build:swan` | `pnpm dev:swan` | `project.swan.json` |
| 支付宝小程序 | `pnpm build:alipay` | `pnpm dev:alipay` | `project.alipay.json` |
| 字节跳动小程序 | `pnpm build:tt` | `pnpm dev:tt` | `project.tt.json` |
| QQ 小程序 | `pnpm build:qq` | `pnpm dev:qq` | `project.qq.json` |
| 京东小程序 | `pnpm build:jd` | `pnpm dev:jd` | `project.jd.json` |

> 各端对应的 IDE 配置文件会在构建时自动拷贝到 `dist/` 下，可直接用对应厂商的开发者工具打开 `dist/` 目录进行预览与调试。

## 快速开始

```bash
# 安装依赖(demo 目录位于仓库根 pnpm-workspace 之外,需显式忽略 workspace)
pnpm install --ignore-workspace

# 本地开发(以微信小程序为例,其余端将 :weapp 替换为对应端标识即可)
pnpm dev:weapp

# 构建(以微信小程序为例)
pnpm build:weapp
```

构建完成后使用对应厂商开发者工具打开 `dist/` 目录即可加载调试。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `pnpm build:<平台>` | 构建对应端的生产产物到 `dist/` |
| `pnpm dev:<平台>` | 以 watch 模式启动对应端的开发构建 |
| `pnpm new` | 使用 Taro generator 新建页面 / 组件等 |

> `<平台>` 可选值:`weapp`、`swan`、`alipay`、`tt`、`qq`、`jd`。

## 目录结构

```text
.
├── config/                 # Taro 构建配置
│   ├── dev.ts              # 开发环境配置
│   ├── index.ts            # 基础配置入口(仅含 mini 段)
│   └── prod.ts             # 生产环境配置
├── src/
│   ├── app.config.ts       # 应用级配置
│   ├── app.scss            # 全局样式(空占位)
│   ├── app.ts              # 应用入口
│   └── pages/              # 页面目录
├── types/                  # 全局类型声明(TARO_ENV 联合已收窄为 6 个小程序端)
├── project.config.json     # 微信小程序开发者工具配置
├── project.swan.json       # 百度小程序开发者工具配置
├── project.alipay.json     # 支付宝小程序开发者工具配置
├── project.tt.json         # 字节跳动小程序开发者工具配置
├── project.qq.json         # QQ 小程序开发者工具配置
├── project.jd.json         # 京东小程序开发者工具配置
├── .env.development        # 开发环境变量(如各端 AppID)
├── .env.production         # 生产环境变量
├── .env.test               # 测试环境变量
├── package.json            # 脚本与依赖配置
└── tsconfig.json           # TypeScript 配置
```

## 质量门禁

提交信息通过 Husky `commit-msg` hook 调用 `commitlint` 校验，默认遵循 Conventional Commits，例如：

```bash
git commit -m "feat: add user profile page"
```

> 当前项目尚未内置 `typecheck` / `lint` / `lint:style` 脚本与 `pre-commit` 校验，如需统一质量检查，可参考 [lite-webpack5-h5](../lite-webpack5-h5) 模板补充。
