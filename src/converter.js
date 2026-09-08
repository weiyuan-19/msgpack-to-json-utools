import { decode, ExtData } from "@msgpack/msgpack";

const MAX_TEXT_LENGTH = 16 * 1024 * 1024;
const MAX_DEPTH = 256;

function parseHex(text) {
  const source = text.replace(/^hex\s*:/i, "").trim();
  const compact = source.replace(/0x/gi, "").replace(/[\s,;:_-]+/g, "");
  if (!compact || !/^[0-9a-f]+$/i.test(compact)) return null;
  if (compact.length % 2 !== 0) throw new Error("Hex 字符数必须为偶数");

  const bytes = new Uint8Array(compact.length / 2);
  for (let index = 0; index < compact.length; index += 2) {
    bytes[index / 2] = Number.parseInt(compact.slice(index, index + 2), 16);
  }
  return bytes;
}

export function parseInput(rawInput) {
  const text = rawInput.trim();
  if (!text) throw new Error("请先粘贴 Hex 格式的 MessagePack 数据");
  if (text.length > MAX_TEXT_LENGTH) throw new Error("输入过大，最多支持 16 MB 文本");

  const hexBytes = parseHex(text);
  if (hexBytes) return { bytes: hexBytes, format: "Hex" };
  throw new Error("Hex 内容无效，请只粘贴十六进制 MessagePack 数据");
}

function bytesToBase64(bytes) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary);
}

function normalize(value, state, depth = 0) {
  if (depth > MAX_DEPTH) throw new Error("数据嵌套超过 256 层，已停止转换");
  if (value === null || typeof value === "string" || typeof value === "boolean") return value;

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      state.warnings.add("非有限数字已转换为字符串");
      return String(value);
    }
    return value;
  }

  if (typeof value === "bigint") {
    state.warnings.add("64 位整数已转换为字符串，以避免精度丢失");
    return value.toString();
  }

  if (value instanceof Date) return value.toISOString();

  if (value instanceof ExtData) {
    state.warnings.add("Extension 类型已保留为带类型编号的 Base64 数据");
    return {
      $extension: {
        type: value.type,
        data: bytesToBase64(value.data),
      },
    };
  }

  if (value instanceof Uint8Array) {
    state.warnings.add("二进制数据已转换为 Base64");
    return { $binary: bytesToBase64(value) };
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalize(item, state, depth + 1));
  }

  if (value instanceof Map) {
    const entries = [...value.entries()];
    if (entries.every(([key]) => typeof key === "string")) {
      const result = Object.create(null);
      for (const [key, item] of entries) result[key] = normalize(item, state, depth + 1);
      return result;
    }
    state.warnings.add("含非字符串 Map 键，已转换为键值对数组");
    return {
      $map: entries.map(([key, item]) => [
        normalize(key, state, depth + 1),
        normalize(item, state, depth + 1),
      ]),
    };
  }

  if (typeof value === "object") {
    const result = Object.create(null);
    for (const [key, item] of Object.entries(value)) {
      result[key] = normalize(item, state, depth + 1);
    }
    return result;
  }

  throw new Error(`无法转换的数据类型：${typeof value}`);
}

export function convertMessagePack(rawInput) {
  const { bytes, format } = parseInput(rawInput);
  if (bytes.length === 0) throw new Error("MessagePack 内容为空");

  const decoded = decode(bytes, {
    useBigInt64: true,
    maxStrLength: 16 * 1024 * 1024,
    maxBinLength: 16 * 1024 * 1024,
    maxArrayLength: 1_000_000,
    maxMapLength: 1_000_000,
  });
  const state = { warnings: new Set() };
  const normalized = normalize(decoded, state);

  return {
    json: JSON.stringify(normalized, null, 2),
    format,
    byteLength: bytes.length,
    warnings: [...state.warnings],
  };
}
