// node-sass@9 在 macOS arm64 + 新版 Node 下无法运行；而 @tarojs/rn-style-transformer
// 处理 scss 时会优先 require('node-sass')。sass-loader 把 node-sass 声明为可选 peer，
// 经 pnpm auto-install-peers 自动装入后会被探测命中并崩溃。这里在解析阶段剔除该可选
// peer，使其回退到项目已装的 dart-sass（sass），且不影响其它 peer 的自动安装。
function readPackage(pkg) {
  if (pkg.name === 'sass-loader' && pkg.peerDependencies && pkg.peerDependencies['node-sass']) {
    delete pkg.peerDependencies['node-sass']
    if (pkg.peerDependenciesMeta) {
      delete pkg.peerDependenciesMeta['node-sass']
    }
  }
  return pkg
}

module.exports = {
  hooks: {
    readPackage,
  },
}
