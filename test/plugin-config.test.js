import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const plugin = JSON.parse(
  readFileSync(new URL("../public/plugin.json", import.meta.url), "utf8"),
);
const commands = plugin.features[0].cmds;

test("keeps exactly the requested text commands", () => {
  assert.deepEqual(commands.filter((command) => typeof command === "string"), [
    "msgpack-to-json",
    "msg2json",
    "MessagePack 转 JSON",
  ]);
});

test("matches copied Hex without treating ordinary text as Hex", () => {
  const command = commands.find((item) => item.type === "regex");
  assert.ok(command);

  const literal = /^\/([\s\S]*)\/([a-z]*)$/.exec(command.match);
  assert.ok(literal);
  const matcher = new RegExp(literal[1], literal[2]);

  assert.equal(matcher.test("0x83AD63757273CF6A9C3C80"), true);
  assert.equal(matcher.test("82 a2 69 64 01"), true);
  assert.equal(matcher.test("82a2696401"), true);
  assert.equal(matcher.test("msgpack-to-json"), false);
  assert.equal(matcher.test("0x123"), false);
});
