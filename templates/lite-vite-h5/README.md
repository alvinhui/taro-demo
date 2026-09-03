# Taro H5 Lite 模板

一个面向 H5 单端场景的轻量 Taro 4 + React + TypeScript + Sass 项目模板。

本模板从 [Taro v4 模板](https://github.com/NervJS/taro/tree/v4.2.1/packages/taro-cli/templates/default) 裁剪而来，仅保留 H5 必要配置，适合需要复用 Taro DSL、组件体系或未来存在多端扩展可能的 H5 项目。

## 技术栈

- Taro 4.2.1
- React 18
- TypeScript
- Sass
- Vite 编译器
- ESLint + Stylelint
- Husky + Commitlint + lint-staged

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
| `pnpm lint` | 检查 `src/**/*.ts` 与 `src/**/*.tsx` |
| `pnpm lint:style` | 检查 `src/**/*.scss` 与 `src/**/*.css` |
| `pnpm run check` | 串行执行类型、脚本和样式检查 |
| `pnpm new` | 使用 Taro generator 新建页面/组件等 |

## 目录结构

```text
.
├── config/                 # Taro 构建配置
│   ├── dev.ts              # 开发环境配置
│   ├── index.ts            # 基础配置入口
│   └── prod.ts             # 生产环境配置
├── src/
│   ├── app.config.ts       # 应用级配置
│   ├── app.scss            # 全局样式
│   ├── app.ts              # 应用入口
│   ├── index.html          # H5 HTML 模板
│   └── pages/              # 页面目录
├── types/                  # 全局类型声明
├── package.json            # 脚本、依赖与 lint-staged 配置
└── tsconfig.json           # TypeScript 配置
```

## 质量门禁

模板默认提供两层质量检查：

1. 手动执行 `pnpm run check`，会依次运行 `typecheck`、`lint`、`lint:style`。
2. 提交前自动执行 Husky `pre-commit`：先跑全量 `typecheck`，再通过 `lint-staged` 检查本次提交涉及的脚本和样式文件。

提交信息通过 `commitlint` 校验，默认遵循 Conventional Commits，例如：

```bash
git commit -m "feat: add user profile page"
```