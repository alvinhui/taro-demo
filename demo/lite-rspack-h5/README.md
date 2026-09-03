# lite-rspack-h5

一个面向 H5 单端场景的轻量 Taro 4 + React 项目。

本项目由 Taro H5 Lite 模板生成，该模板从 [Taro v4 默认模板](https://github.com/NervJS/taro/tree/main/packages/taro-cli/templates/default) 裁剪而来，仅保留 H5 必要配置，适合需要复用 Taro DSL、组件体系或未来存在多端扩展可能的 H5 项目。

## 技术栈

- Taro 4
- React 18
- TypeScript
- Sass
- Rspack 编译器（官方原生 `compiler: 'rspack'`，见下方说明）
- ESLint + Stylelint
- Husky + Commitlint + lint-staged

> 本示例的业务源码和质量门禁与 `open-lite-webpack5-h5` 保持一致，仅使用不同的 H5 构建器，用于验证 Taro H5 在 Rspack 下的构建能力。

本示例改为使用 Taro 官方原生 `compiler: 'rspack'`（`config/index.ts` 中 `type: 'h5'` + `compiler: 'rspack'`），对应的 CLI/service/H5 平台/React 框架层改动尚未合入 [NervJS/taro](https://github.com/NervJS/taro) 主仓库，当前依赖 fork 仓库 [alvinhui/taro](https://github.com/alvinhui/taro)（Draft PR [#19490](https://github.com/NervJS/taro/pull/19490)）的源码，通过 `package.json` 里的 `link:` 协议按当前仓库与 fork 仓库的同级目录关系引用。

## 快速开始

### 前置条件：准备 fork 仓库源码

依赖包（`@tarojs/cli`、`@tarojs/rspack-runner`、`@tarojs/plugin-platform-h5`、`@tarojs/plugin-framework-react`、`@tarojs/router`）均以 `link:` 协议指向同级目录中的 fork 仓库 `~/Documents/www/github/alvinhui/taro`（相对于本示例为 `../../../taro`，如目录关系不同需同步修改）。首次使用前，需在该 fork 仓库内完成以下构建：

```bash
cd ~/Documents/www/github/alvinhui/taro

# 1. 安装依赖
pnpm install

# 2. 编译 Rust native binding（@tarojs/binding 依赖，taro-cli 顶层 require 链上，
#    缺失时 Config 加载会静默失败，报错具有极强误导性）
cd crates/native_binding && pnpm run build && cd ../..

# 3. 全量构建各包 dist 产物
pnpm build

# 4. 单独构建 @tarojs/components 的 lib/react、lib/vue3、lib/solid
#    （build:ci 默认不包含这一步，只做 stencil build）
cd packages/taro-components && pnpm run build:library && cd ../..
```

由于 `demo/lite-rspack-h5` 在 monorepo 源码目录（而非 `.pnpm` 虚拟存储）里以 `link:` 方式引用这些包，pnpm 不会像安装已发布包那样自动生成"包指向自己/指向同仓库其他包"的 self-reference symlink，需要手动补齐（否则会报 `Module not found`）：

```bash
cd ~/Documents/www/github/alvinhui/taro/packages

ln -s ../../taro-components taro-components/node_modules/@tarojs/components
ln -s ../../taro-platform-h5 taro-platform-h5/node_modules/@tarojs/plugin-platform-h5
ln -s ../../taro-framework-react taro-framework-react/node_modules/@tarojs/plugin-framework-react
ln -s ../../taro-framework-react taro-h5/node_modules/@tarojs/plugin-framework-react
```

（注意目录名与 npm 包名不一致：`taro-platform-h5` 对应 `@tarojs/plugin-platform-h5`，`taro-framework-react` 对应 `@tarojs/plugin-framework-react`。`pnpm install` 重跑会清掉这些手动 symlink，需要重新执行。）

### 安装并构建本示例

```bash
# 安装依赖（需在当前仓库内使用，以解析本地依赖）
pnpm install --ignore-workspace

# 本地开发 H5
pnpm dev:h5

# 构建 H5
pnpm build:h5

# 运行质量检查
pnpm run check
```

`build:h5` 默认带 `--no-check`，用于跳过 Taro CLI 内置的远程 config schema 校验——该校验由独立维护的 [taro-doctor](https://github.com/NervJS/taro-doctor) 仓库提供，尚未收录 `compiler: 'rspack'` 这一新枚举值，不加会报"compiler 的值 rspack 不符合类型要求"并中止构建。待上游收录后可移除该参数。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `pnpm dev:h5` | 启动 H5 watch 构建 |
| `pnpm build:h5` | 使用 Rspack 构建 H5 生产产物到 `dist/` |
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
2. 项目作为独立 Git 仓库安装依赖后，提交前自动执行 Husky `pre-commit`：先跑全量 `typecheck`，再通过 `lint-staged` 检查本次提交涉及的脚本和样式文件。当前 demo 作为本仓库子目录运行时，不会接管父仓库的 Git hooks。

提交信息通过 `commitlint` 校验，默认遵循 Conventional Commits，例如：

```bash
git commit -m "feat: add user profile page"
```

## 环境变量

当前项目未内置 `.env.*` 文件，避免把项目级环境配置固化下来。

如业务需要环境变量，可按 Taro 规范新增 `.env.development`、`.env.production` 等文件，并优先使用 `TARO_APP_` 前缀，例如：

```bash
TARO_APP_API_BASE_URL=https://example.com
```
同时建议在 `types/global.d.ts` 中补充对应的 `ProcessEnv` 类型声明。
