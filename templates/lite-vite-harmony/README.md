# lite-vite-harmony

仅包含一个 `Hello World` 页面的 Taro Harmony-CPP 示例。

项目默认使用 Vite，并且只包含 Harmony-CPP 平台插件与构建脚本。

## 使用

```bash
pnpm install --ignore-workspace
pnpm build:harmony
pnpm build:hap
pnpm dev:harmony
```

- `pnpm build:harmony`：调用公共 Harmony 脚本选择当前 demo，只生成 Taro Harmony-CPP 产物。
- `pnpm build:hap`：在 `build:harmony` 完成后手动执行，安装 OpenHarmony 依赖并构建 debug HAP。
- `pnpm dev:harmony`：监听 `src/` 与 `config/`，源码变化后只重新生成 Taro Harmony-CPP 产物，不自动构建 HAP。
- 默认使用 macOS 的 `/Applications/DevEco-Studio.app`；其他安装位置可通过 `DEVECO_STUDIO_HOME` 指定。
- 调试时使用 DevEco Studio 打开仓库根目录的 `../../harmony/`，选择设备或模拟器后运行 `entry`。

Taro 4.2.1 内置的 Harmony-CPP `--watch` 会因上游 `loaderMeta` 初始化问题退出，因此调试脚本采用零依赖的串行 Taro 重构建方式，避免修改或补丁化 `node_modules`。需要更新 HAP 时再手动执行 `pnpm build:hap`。

## 最小化说明

仓库根目录的 `../../harmony/` 是两个 Harmony-CPP demo 共用的 DevEco 壳工程，基于 `NervJS/taro-harmony-project` 裁剪，仅保留 `entry` 模块和构建必需资源。Taro C++ 核心库在构建时从当前 demo 的 `@tarojs/plugin-platform-harmony-cpp` 复制，不提交 `../../harmony/static/`，也不保留模板中的 `library/`、C++ 子模块、测试、Mock、备份 Ability、release 配置和原生示例页面。

共享壳工程保存最近一次 demo 的 Taro 生成结果，因此不要并行构建两个 Harmony-CPP demo；执行 `pnpm build:hap` 前，应先在当前 demo 中执行 `pnpm build:harmony`。完整的构建与调试说明见 [`../../harmony/README.md`](../../harmony/README.md)。

`@tarojs/plugin-platform-harmony-ets` 仅作为 Harmony-CPP 插件声明的类型依赖安装，项目没有启用 Harmony-ETS 平台。
