# Harmony-CPP 公共壳工程

供以下 Taro 示例共用的最小 HarmonyOS Stage 工程：

- `templates/lite-vite-harmony`
- `templates/lite-webpack5-all`

Harmony 工程通过命令选择需要写入的 demo。`entry/src/main/ets/`、`entry/src/main/resources/rawfile/` 和最终 HAP 都是生成物，不提交到 Git。

## 环境准备

1. 安装 DevEco Studio，并在 SDK Manager 中安装 HarmonyOS `5.0.2(14)` SDK。
2. 在需要使用的 demo 中安装 npm 依赖：

```bash
pnpm --dir ../templates/lite-vite-harmony install --ignore-workspace
pnpm --dir ../templates/lite-webpack5-all install --ignore-workspace
```

默认从 `/Applications/DevEco-Studio.app` 查找 DevEco 工具。安装在其他位置时设置 `DEVECO_STUDIO_HOME`。

## 构建

进入本目录，根据需要选择一个 demo：

```bash
cd harmony

# 选择 Vite demo，生成 Taro Harmony-CPP 产物
pnpm build:vite

# 或选择 Webpack5 全平台 demo
pnpm build:webpack5

# 手动执行 HAP 构建
pnpm build:hap
```

`build:vite` 和 `build:webpack5` 会清理上一个 demo 的生成代码和 HAP，再把选中 demo 的 Taro 产物写入公共壳工程。它们本身不生成 HAP，并会记录当前选中的 demo；`build:hap` 构建最近一次成功生成的 demo。

HAP 输出位置：

```text
entry/build/default/outputs/default/entry-default-unsigned.hap
```

共享工程一次只能保存一个 demo 的生成结果，不要并行构建两个 demo。切换 demo 时重新执行对应的 `build:*`，再执行 `build:hap`。

## 调试

启动选中 demo 的源码监听：

```bash
# 监听 Vite demo
pnpm dev:vite

# 或监听 Webpack5 全平台 demo
pnpm dev:webpack5
```

监听命令会立即生成一次 Taro 产物，并在对应 demo 的 `src/` 或 `config/` 变化后重新生成，但不会自动构建 HAP。

使用 DevEco Studio 调试：

1. 用 DevEco Studio 打开本 `harmony/` 目录。
2. 启动 HarmonyOS `5.0.2(14)` 模拟器或连接设备。
3. 先执行对应的 `pnpm build:vite` 或 `pnpm build:webpack5`。
4. 在 DevEco Studio 中选择 `entry`，点击 Run 或 Debug。
5. Taro 源码变化后由 `dev:*` 更新生成代码，再在 DevEco Studio 中重新 Run；需要命令行 HAP 时手动执行 `pnpm build:hap`。

Taro 4.2.1 的 Harmony-CPP `--watch` 存在上游 `loaderMeta` 初始化问题，因此这里使用串行重构建监听，不修改 `node_modules`。
