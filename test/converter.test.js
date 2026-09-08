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

test("rejects malformed Hex", () => {
  assert.throws(() => parseInput("abc"), /偶数/);
  assert.throws(() => parseInput("zz"), /Hex 内容无效/);
});

test("rejects trailing MessagePack bytes", () => {
  assert.throws(() => convertMessagePack("0102"));
});
