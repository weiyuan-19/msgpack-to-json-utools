# msgpack-to-json-utools

一个专注于 MessagePack 解码的 uTools 插件。粘贴 Hex 格式的 MessagePack
数据，即可得到格式化 JSON。

## 功能

- 支持带空格、换行、常见分隔符或 `hex:` 前缀的 Hex 输入
- 复制 Hex 后呼出 uTools，可直接匹配插件并自动转换
- 输出两空格缩进的 JSON
- 安全处理 64 位整数、二进制和 MessagePack Extension 类型
- 严格拒绝损坏数据和尾随字节
- 输入只存在于当前窗口，不保存、不上传、不发起外部网络请求

## 环境要求

- Node.js 20.19+ 或 22.12+
- npm
- uTools 与「uTools 开发者工具」插件

## 安装依赖

```bash
npm install
```

## 构建插件

```bash
npm run build
```

构建结果固定生成到 `plugin/`：

```text
plugin/
├── assets/
├── index.html
├── logo.png
├── plugin.json
└── THIRD_PARTY_NOTICES.txt
```

在 uTools 开发者工具中选择 `plugin/plugin.json` 接入开发、打包或发布。

## 持续开发

首次构建并在 uTools 中导入 `plugin/plugin.json` 后，运行：

```bash
npm run dev
```

该命令会监听源码变化并持续重建 `plugin/`。修改代码后，在 uTools 中重新打开
插件即可查看最新结果。

## 验证

```bash
npm run check
```

该命令依次运行自动化测试并重新生成生产插件。

## 目录说明

```text
src/          插件功能与界面源码
public/       plugin.json、图标和第三方许可声明
test/         转换逻辑测试
plugin/       自动生成的 uTools 插件目录，不提交 Git
refer/        初始参考文件，仅用于迁移核对，不提交 Git
```

## 发布资料

应用市场介绍、使用说明、隐私说明和版本说明维护在
[`MARKETPLACE.md`](./MARKETPLACE.md) 中。
