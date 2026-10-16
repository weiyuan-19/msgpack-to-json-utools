# Change Log

## 0.1.1

- 修复包含 64 位整数 Map 键的 MessagePack 数据无法解析的问题，解决 `The type of key must be string or number but bigint` 报错。
- 将 64 位整数 Map 键无损转换为十进制字符串，并显示转换提示，避免大整数精度丢失。
- 支持嵌套 Map 中的 64 位整数键，保留原有数据校验和安全限制。

## 0.1.0

- 支持 Hex 格式的 MessagePack 输入。
- 支持从 uTools 自动匹配剪贴板中的 Hex 并转换。
- 输出两空格缩进的格式化 JSON。
- 支持复制 JSON。
- 对 64 位整数、二进制和扩展类型进行安全转换与提示。
- 严格拒绝损坏数据和尾随字节。
