# lite-webpack5-h5

一个面向 H5 单端场景的轻量 Taro 4 + React 项目。

本项目由 Taro H5 Lite 模板生成，该模板从 [Taro v4 默认模板](https://github.com/NervJS/taro/tree/main/packages/taro-cli/templates/default) 裁剪而来，仅保留 H5 必要配置，适合需要复用 Taro DSL、组件体系或未来存在多端扩展可能的 H5 项目。

## 技术栈

- Taro 4
- React 18
- TypeScript
- Sass
- Webpack5 编译器
- ESLint + Stylelint
- Husky + Commitlint + lint-staged

> 编译器、是否使用 TypeScript、CSS 预处理器、是否编译为 ES5 均在创建项目时由 Taro CLI 询问选择，可按需切换。

## 快速开始

```bash
# 安装依赖
pnpm install --ignore-workspace

# 本地开发 H5
pnpm dev:h5

# 构建 H5
pnpm build:h5

# 运行质量检查
pnpm run check
```

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `pnpm dev:h5` | 启动 H5 watch 构建 |
| `pnpm build:h5` | 构建 H5 生产产物到 `dist/` |
| `pnpm typecheck` | 执行 TypeScript 类型检查 |
| `pnpm lint` | 检查源码脚本文件 |
| `pnpm lint:style` | 检查样式文件 |
| `pnpm run check` | 串行执行类型、脚本和样式检查 |
| `pnpm new` | 使用 Taro generator 新建页面/组件等 |

## 目录结构

```text
.
├── config/                 # Taro 构建配置
│   ├── dev.*               # 开发环境配置
│   ├── index.*             # 基础配置入口
│   └── prod.*              # 生产环境配置
├── src/
│   ├── app.config.*        # 应用级配置
│   ├── app.(js|ts)         # 应用入口
│   ├── app.(css|scss|...)  # 全局样式
│   ├── index.html          # H5 HTML 模板
│   └── pages/              # 页面目录
├── types/                  # 全局类型声明（仅 TypeScript 项目）
├── package.json            # 脚本、依赖与 lint-staged 配置
└── tsconfig.json           # TypeScript 配置（仅 TypeScript 项目）
```

## 质量门禁

项目默认提供两层质量检查：

1. 手动执行 `pnpm run check`，会依次运行 `typecheck`、 `lint`、`lint:style`。
2. 提交前自动执行 Husky `pre-commit`：先跑全量 `typecheck`，再通过 `lint-staged` 检查本次提交涉及的脚本和样式文件。

提交信息通过 `commitlint` 校验，默认遵循 Conventional Commits，例如：

```bash
git commit -m "feat: add user profile page"
```
