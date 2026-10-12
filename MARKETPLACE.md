# 发布资料

## 插件名称

msgpack-to-json

## 一句话介绍

将文本形式的 MessagePack 快速转换为格式化 JSON。

## 插件介绍

msgpack-to-json 是一个专注于 MessagePack 解码的本地工具。粘贴 Hex 格式的 MessagePack 数据，即可得到便于阅读和复制的格式化 JSON。

所有转换均在插件本地完成。插件不上传、不保存输入内容，不包含广告、统计或网络请求。

## 使用方法

1. 在 uTools 中输入 `msgpack-to-json`、`msg2json` 或 `MessagePack 转 JSON`。
2. 将 Hex 格式的 MessagePack 数据粘贴到左侧输入框。
3. 点击“转换”，或按 `Ctrl/Cmd + Enter`。
4. 在右侧查看并复制格式化后的 JSON。

支持连续 Hex，也支持空格、换行和常见分隔符，例如：`82 a2 69 64 01`。

复制一段 Hex 后呼出 uTools，也可以选择“MessagePack Hex 转 JSON”直接进入并自动转换。

## 隐私说明

输入与输出仅存在于当前插件窗口内。插件关闭或清空后不会保留数据，不访问网络，不使用 Cookie 或其他持久化存储。

## 版本更新记录

### 0.1.1

- 修复包含 64 位整数 Map 键的 MessagePack 数据无法解析的问题，解决 `The type of key must be string or number but bigint` 报错
- 将 64 位整数 Map 键无损转换为十进制字符串，并显示转换提示，避免大整数精度丢失
- 支持嵌套 Map 中的 64 位整数键，保留原有数据校验和安全限制

### 0.1.0

- 支持 Hex 格式的 MessagePack 输入
- 支持从 uTools 自动匹配剪贴板中的 Hex 并转换
- 输出两空格缩进的格式化 JSON
- 支持复制 JSON
- 对 64 位整数、二进制和扩展类型进行安全转换与提示
- 严格拒绝损坏数据和尾随字节
