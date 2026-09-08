# 发布资料

## 插件名称

msgpack-to-json

## 一句话介绍

将文本形式的 MessagePack 快速转换为格式化 JSON。

## 插件介绍

msgpack-to-json 是一个专注于 MessagePack 解码的本地工具。粘贴 Hex 格式的 MessagePack 数据，即可得到便于阅读和复制的格式化 JSON。

所有转换均在插件本地完成。插件不上传、不保存输入内容，不包含广告、统计或网络请求。

## 使用方法

1. 在 uTools 中输入 `msgpack-to-json`、`msg2json`、`MessagePack 转 JSON` 或 `MP 转 JSON`。
2. 将 Hex 格式的 MessagePack 数据粘贴到左侧输入框。
3. 点击“转换”，或按 `Ctrl/Cmd + Enter`。
4. 在右侧查看并复制格式化后的 JSON。

支持连续 Hex，也支持空格、换行和常见分隔符，例如：`82 a2 69 64 01`。

## 隐私说明

输入与输出仅存在于当前插件窗口内。插件关闭或清空后不会保留数据，不访问网络，不使用 Cookie 或其他持久化存储。

## 首个版本说明

版本：0.1.0

- 支持 Hex 格式的 MessagePack 输入
- 输出两空格缩进的格式化 JSON
- 支持复制 JSON
- 对 64 位整数、二进制和扩展类型进行安全转换与提示
- 严格拒绝损坏数据和尾随字节
