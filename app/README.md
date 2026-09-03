# app —— RN 公共原生壳工程

本目录（仓库根 `app/`）是一个 **React Native 原生壳工程**，被 demo 目录下多个 Taro RN 项目**共享复用**，用来验证它们 `taro build --type rn` 产出的 JS bundle 能否被 iOS / Android 原生 App 正确加载、编译、运行、调试。

当前复用它的项目：
- `lite-webpack5-all`（多端示例的 RN 端）
- `lite-webpack5-rn`（纯 RN 示例）

**可复用的前提**：这些项目的 RN 运行时依赖必须与本壳一致——

1. `react-native@0.73`、`@tarojs/*-rn@4.2.1`、`react-native-gesture-handler@~2.14.0`、`safe-area-context@4.8.2`、`screens@~3.29.0`
2. `config/index.ts` 的 `rn.appName` 均为 `taroDemo`（壳的原生工程 bundleId/包名固定为 `taroDemo`/`com.tarodemo`）。

新项目若版本一致即可直接复用；若 RN 版本不同，需另建壳或升级本壳。

## 它和各 demo 的关系

Taro RN 的**分离模式**：JS 侧（各 demo 项目）负责出 bundle，原生壳（本目录）负责把 bundle 装进 App 跑起来。两者各自维护 `node_modules`，通过约定的产物路径协作。

- 各模板的 `config/index.ts` 的 `rn.output` 指向本壳（相对路径 `../../app/`，因为项目在 `templates/<项目>/`，本壳在仓库根 `app/`）：
  - iOS bundle → `app/ios/main.jsbundle`，assets → `app/ios/`
  - Android bundle → `app/android/app/src/main/assets/index.android.bundle`，资源 → `app/android/app/src/main/res/`
- **一次只能承载一个项目的 bundle**：`build:rn` 会覆盖壳里的 bundle，所以验证哪个项目就先在哪个项目跑 `build:rn`，再编译壳。
- 这些 bundle 产物**不入库**（见 `.gitignore`），每次验证前由对应 demo 重新构建生成。

## 目录本身不含业务代码

壳工程没有 `src/`，业务 JS 全部来自各 demo 的 `src/`。壳工程只有：原生工程（`android/`、`ios/`）、RN 标准入口（`index.js`、`metro.config.js`、`babel.config.js`）、以及消费 bundle 所需的原生依赖（`package.json`）。

## 环境依赖

| 工具 | 版本 | 用途 | 安装方式 |
| :--- | :--- | :--- | :--- |
| Node | 18+（实测 22.x） | Metro / RN CLI | nvm 等 |
| pnpm | 10.x | 装壳工程依赖 | `npm i -g pnpm` |
| JDK | 17 | Gradle 8.3 + AGP | `brew install openjdk@17` |
| Android SDK | platform 34 / build-tools 34 / platform-tools / emulator / system-image android-34 google_apis arm64-v8a | Android 构建与模拟器 | Android Studio 或 `cmdline-tools` + `sdkmanager` |
| Ruby | 3.0+（系统自带 2.6 太老，装 `brew install ruby`） | CocoaPods 依赖 | `brew install ruby` |
| CocoaPods | 1.13+ | iOS 原生依赖 | 本目录 `Gemfile` + `bundle install` |
| Xcode | 15+（实测 26.x） | iOS 构建与模拟器 | App Store |

### 关键环境变量

```bash
export JAVA_HOME=/opt/homebrew/opt/openjdk@17
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"
# 用 brew ruby（系统 2.6 太老，装不了新版 cocoapods 依赖）
export PATH="/opt/homebrew/opt/ruby/bin:$PATH"
```

`android/local.properties` 需指向 SDK（已 gitignore，含机器绝对路径，需各自创建）：

```
sdk.dir=/Users/<you>/Library/Android/sdk
```

## 一次性初始化

```bash
# 1. 装壳工程 JS 依赖（本目录 app/ 独立 node_modules，与各 demo 隔离）
cd app
pnpm install --ignore-workspace

# 2. 装 iOS 原生依赖（CocoaPods 装到项目本地，不污染系统 gem）
cd ios
bundle config set --local path 'vendor/bundle'
bundle install
bundle exec pod install
cd ..

# 3. Android：创建 local.properties（见上）
```

## Release 验证：消费 demo 产出的离线 bundle

原理：壳工程被配置为**不用自己的 JS 重新打包**，直接使用 demo 放进来的 bundle 文件。

- **Android**：`android/app/build.gradle` 的 `react { debuggableVariants = ["debug", "release"] }` —— release 也列入后，RN Gradle Plugin 不再创建 `createBundleReleaseJsAndAssets` 任务，`src/main/assets/index.android.bundle` 会被原样打进 APK（Android 的 assets 默认打包机制）。
- **iOS**：`ios/taroDemo.xcodeproj` 的 "Bundle React Native code and images" build phase 脚本被改写——不再调用会重新打包的 `react-native-xcode.sh`，而是 Debug 走 Metro（不拷贝）、Release 把 demo 已生成的 `ios/main.jsbundle` + `ios/assets` 拷进 `.app` 资源目录，找不到 bundle 时明确报错提示先构建。（最初尝试过 `SKIP_BUNDLING=YES`，但它会连"把 bundle 拷进 app"一起跳过，导致 app 内无 bundle，故改用自定义拷贝脚本。）

步骤（以验证 `lite-webpack5-rn` 为例；验证 `lite-webpack5-all` 把项目名替换即可）：

```bash
# 1. 在要验证的模板项目里出 release bundle 到壳工程（rn.output 已配 ../../app）
cd templates/lite-webpack5-rn
NODE_ENV=production pnpm build:rn --platform ios
NODE_ENV=production pnpm build:rn --platform android

# 2. iOS：在壳工程编译并装到模拟器（不要在编译前 rm -rf ios/build，否则 RN codegen 产物被删会报
#    "FBReactNativeSpec-generated.mm not found"；要清就连带重跑 pod install）
cd ../../app
xcodebuild -workspace ios/taroDemo.xcworkspace -scheme taroDemo \
  -configuration Release -sdk iphonesimulator \
  -destination 'generic/platform=iOS Simulator' \
  -derivedDataPath ios/build CODE_SIGNING_ALLOWED=NO build
# 编译日志出现 "Copied external bundle from demo into ...taroDemo.app" 即消费成功
xcrun simctl boot "iPhone 17 Pro"
xcrun simctl install "iPhone 17 Pro" ios/build/Build/Products/Release-iphonesimulator/taroDemo.app
xcrun simctl launch "iPhone 17 Pro" org.reactjs.native.example.taroDemo

# 3. Android：编译并装到模拟器
emulator -avd taro_test &
adb wait-for-device
cd android && ./gradlew assembleRelease
adb install -r app/build/outputs/apk/release/app-release.apk
adb shell am start -n com.tarodemo/.MainActivity
```

看到 demo 的页面内容（导航栏「首页」+「Hello world!」，不是黑屏 / 红屏），即证明 release 消费外部 bundle 成功。

### 实测状态（2026-09-02，Xcode 26.3 / Android SDK 34 / macOS arm64）

公共壳消费 **两个项目** 的 bundle 均验证过，模拟器渲染出对应页面（本示例的 `src` 都是「首页」+「Hello world!」）：

- **`lite-webpack5-all`**：iOS（`xcodebuild` Release 成功、bundle 拷入 `.app`、iPhone 17 Pro 模拟器渲染正常）+ Android（`assembleRelease` 成功、APK 内 bundle 字节与产物一致、模拟器渲染正常）均跑通。
- **`lite-webpack5-rn`**：Android 端到端跑通（APK 内 `index.android.bundle` 为该项目产物、模拟器渲染出「首页 / Hello world!」）；iOS 编译成功、`-rn` 的 bundle 已拷入 `.app`（运行链路与 all 项目同源，不再重复跑模拟器）。

要点：APK/`.app` 里的 bundle 就是当前在对应 demo 项目跑 `build:rn` 产出的那份（字节数可核对），证明壳消费的是**外部 bundle** 而非自己重新打包。

> 排查提示：
> - iOS：若 `simctl launch` 无响应、`simctl spawn`/`get_app_container` 也超时，多半是 **CoreSimulator 服务卡死**（高负载时易发），并非 app 崩溃。用 `killall -9 com.apple.CoreSimulator.CoreSimulatorService` + 重新 `simctl boot` 恢复；`simctl spawn <dev> launchctl list | grep taro` 能看到进程状态。
> - Android：新 boot 的模拟器高负载时会弹「System UI isn't responding」盖住画面，但 app 已在前台（`dumpsys activity | grep topResumedActivity` 可见 `com.tarodemo/.MainActivity`）。`adb shell am force-stop com.android.systemui` 让 systemui 重启即可露出 app。
> - 判断 app 是否真在跑，以进程/焦点状态为准，不要只看截图（截图时机可能在 app 到前台或系统稳定之前）。

## Debug 验证：连 demo 的 Metro 热更新调试

原理：debug 模式下原生 App 不打包 JS，而是通过 HTTP 连 Metro server 实时拉取。Metro 由 **要调试的 demo 项目**启动（用它的 JS 源码），壳工程只是瘦客户端。Metro 是 TCP server，两个工程在不同 `node_modules` 树互不影响。

```bash
# 1. 在要调试的模板项目起 Metro（以 lite-webpack5-rn 为例）
cd templates/lite-webpack5-rn
npm run dev:rn        # taro build --type rn --watch，起 Metro on :8081

# 2. 另开终端，壳工程侧跑 debug 变体
cd app
npx react-native run-ios      # 或 run-android
```

改动该 demo 的 `src/pages/index/index.tsx` 保存，模拟器应热更新。

> 同一时刻只连一个 demo 的 Metro（都用 8081 端口）。切换调试对象时，先停掉上一个 demo 的 `dev:rn`。
> 模拟器连 Metro：iOS 模拟器直接连 `localhost:8081`；Android 模拟器通过 `adb reverse tcp:8081 tcp:8081`（`run-android` 会自动做）连宿主机的 8081。

## 常见问题（均为搭建本工程时实际踩到的坑）

- **Android `Could not get unknown property 'release' for SoftwareComponent`**：RN 0.73 模板默认 `kotlinVersion = "1.8.0"`，而 expo-modules-core 1.11.14 需要 Kotlin 1.9.x。已在 `android/build.gradle` 改为 `kotlinVersion = "1.9.24"` + `kspVersion = "1.9.24-1.0.20"`。
- **Android `No route to host` 下载 kotlinx-coroutines 等 jar 失败**：subproject 回退到 `repo.maven.apache.org`（本网络不通）。已在 `android/build.gradle` 的 `allprojects.repositories` 加 aliyun 镜像，让所有 subproject 优先走国内源。
- **Android `[CXX1101] NDK ... did not have a source.properties file`**：NDK（`ndk;25.1.8937393`）没装或下载不完整。`sdkmanager` 下大包（NDK/emulator/system-image）易被网络中断，`source.properties` 缺失即不完整，删掉重下。
- **Android release 崩溃 "no bundle URL"**：确认 `debuggableVariants` 含 `release` 且 `assets/index.android.bundle` 存在（先在 demo 侧 `build:rn --platform android`）。
- **iOS `FBReactNativeSpec-generated.mm not found`**：`rm -rf ios/build` 删掉了 RN codegen 产物，但 codegen build phase 因增量分析没重跑。解决：清了 build 目录就连带重跑 `pod install`，或干脆别删 build 目录做增量编译。
- **iOS app 内无 `main.jsbundle`**：不要用 `SKIP_BUNDLING=YES`（它会连拷贝一起跳过）。本工程改用自定义 build phase 脚本在 Release 时拷贝，见上文 Release 验证章节。
- **`pod install` 报 ffi 需要 ruby >= 3.0**：系统 ruby 2.6 太老，`brew install ruby` 后把 `/opt/homebrew/opt/ruby/bin` 加到 PATH 前。本工程 `Gemfile` 已精简为只含 cocoapods（去掉了 fastlane，避免拉入更多新 ruby 依赖）。
- **改了 demo 的代码 release 不生效**：release 是离线 bundle，必须重新 `npm run build:rn` 再重新编译原生工程。
