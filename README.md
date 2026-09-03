# taro-demo

Taro 4 示例与模板集合。`demo/` 和 `templates/` 下的每个项目均独立维护 `package.json` 与锁文件。

## 示例清单

| 目录 | 构建器 | 端类型 | 说明 |
| --- | --- | --- | --- |
| [lite-rspack-h5](./demo/lite-rspack-h5) | rspack | H5 | 使用 `h5-lite` 模板 + rspack runner 的 H5 Lite 示例，依赖本地 link 的 Taro fork 源码（详见子目录 README） |

## 模板清单

| 目录 | 构建器 | 端类型 |
| --- | --- | --- |
| [lite-vite-h5](./templates/lite-vite-h5) | Vite | H5 |
| [lite-vite-harmony](./templates/lite-vite-harmony) | Vite | Harmony-CPP |
| [lite-webpack5-all](./templates/lite-webpack5-all) | Webpack5 / Metro / Vite | 全端 |
| [lite-webpack5-h5](./templates/lite-webpack5-h5) | Webpack5 | H5 |
| [lite-webpack5-mini](./templates/lite-webpack5-mini) | Webpack5 | 小程序 |
| [lite-webpack5-rn](./templates/lite-webpack5-rn) | Metro | React Native |

公共原生壳位于 [`app/`](./app)，公共 Harmony-CPP 壳位于 [`harmony/`](./harmony)。
