import test from "node:test";
import assert from "node:assert/strict";
import { encode } from "@msgpack/msgpack";
import { convertMessagePack, parseInput } from "../src/converter.js";

test("converts hex MessagePack into formatted JSON", () => {
  const result = convertMessagePack("82a2696401a46e616d65a57465737431");
  assert.equal(result.format, "Hex");
  assert.deepEqual(JSON.parse(result.json), { id: 1, name: "test1" });
});

test("accepts spaced Hex with an explicit prefix", () => {
  const result = convertMessagePack("hex: 81 a2 6f 6b c3");
  assert.equal(result.format, "Hex");
  assert.deepEqual(JSON.parse(result.json), { ok: true });
});

test("rejects non-Hex input formats", () => {
  assert.throws(() => parseInput("base64:gqJvaw=="), /Hex 内容无效/);
  assert.throws(() => parseInput("[1, 2, 3]"), /Hex 内容无效/);
  assert.throws(() => parseInput("Uint8Array([1, 2, 3])"), /Hex 内容无效/);
});

test("keeps 64-bit integers precise", () => {
  const bytes = encode(9_007_199_254_740_993n, { useBigInt64: true });
  const result = convertMessagePack(Buffer.from(bytes).toString("hex"));
  assert.equal(JSON.parse(result.json), "9007199254740993");
  assert.match(result.warnings.join(" "), /精度/);
});

test("converts nested unsigned 64-bit map keys without losing precision", () => {
  const bytes = Buffer.concat([
    Buffer.from([0x81]),
    encode("items"),
    Buffer.from([0x82]),
    encode(42n, { useBigInt64: true }),
    encode(true),
    encode(18_446_744_073_709_551_615n, { useBigInt64: true }),
    encode(false),
  ]);
  const result = convertMessagePack(`0x${bytes.toString("hex")}`);
  assert.deepEqual(JSON.parse(result.json), {
    items: { "42": true, "18446744073709551615": false },
  });
  assert.deepEqual(result.warnings, ["64 位整数 Map 键已转换为字符串，以避免精度丢失"]);
});

test("keeps signed 64-bit map keys and values precise", () => {
  const bytes = Buffer.concat([
    Buffer.from([0x81]),
    encode(-9_223_372_036_854_775_808n, { useBigInt64: true }),
    encode(9_007_199_254_740_993n, { useBigInt64: true }),
  ]);
  const result = convertMessagePack(bytes.toString("hex"));
  assert.deepEqual(JSON.parse(result.json), {
    "-9223372036854775808": "9007199254740993",
  });
  assert.equal(result.warnings.length, 2);
  assert.match(result.warnings[0], /Map 键/);
  assert.match(result.warnings[1], /精度/);
});

test("continues accepting ordinary integer and string map keys", () => {
  const result = convertMessagePack("8201c3a26f6bc2");
  assert.deepEqual(JSON.parse(result.json), { "1": true, ok: false });
  assert.deepEqual(result.warnings, []);
});

test("continues rejecting unsafe and unsupported map keys", () => {
  const unsafeBytes = Buffer.concat([Buffer.from([0x81]), encode("__proto__"), encode(true)]);
  assert.throws(() => convertMessagePack(unsafeBytes.toString("hex")), /__proto__/);
  assert.equal(Object.hasOwn(Object.prototype, "polluted"), false);
  assert.throws(() => convertMessagePack("81c3c3"), /Map 键类型/);
});

test("continues enforcing map size and nesting limits", () => {
  assert.throws(() => convertMessagePack("df000f4241"), /maxMapLength/);
  assert.throws(() => convertMessagePack("91".repeat(258) + "00"), /嵌套超过 256 层/);
});

test("rejects malformed Hex", () => {
  assert.throws(() => parseInput("abc"), /偶数/);
  assert.throws(() => parseInput("zz"), /Hex 内容无效/);
});

test("rejects trailing MessagePack bytes", () => {
  assert.throws(() => convertMessagePack("0102"));
});
