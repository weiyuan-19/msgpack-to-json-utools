import "./styles.css";
import { convertMessagePack } from "./converter.js";

const input = document.querySelector("#input");
const output = document.querySelector("#output");
const convertButton = document.querySelector("#convert");
const copyButton = document.querySelector("#copy");
const clearButton = document.querySelector("#clear");
const message = document.querySelector("#message");
const detectedFormat = document.querySelector("#detected-format");
const resultMeta = document.querySelector("#result-meta");

function showMessage(text, type = "neutral") {
  message.textContent = text;
  message.dataset.type = type;
}

function convert() {
  try {
    const result = convertMessagePack(input.value);
    output.value = result.json;
    detectedFormat.textContent = result.format;
    resultMeta.textContent = `${result.byteLength.toLocaleString()} bytes`;
    copyButton.disabled = false;
    showMessage(result.warnings.join("；") || "转换成功", result.warnings.length ? "warning" : "success");
  } catch (error) {
    output.value = "";
    detectedFormat.textContent = "Hex";
    resultMeta.textContent = "";
    copyButton.disabled = true;
    showMessage(error instanceof Error ? error.message : String(error), "error");
  }
}

async function copyOutput() {
  if (!output.value) return;
  try {
    if (window.utools?.copyText) {
      window.utools.copyText(output.value);
    } else {
      await navigator.clipboard.writeText(output.value);
    }
    showMessage("JSON 已复制", "success");
  } catch {
    output.focus();
    output.select();
    showMessage("已选中 JSON，请按 Ctrl/Cmd+C 复制", "warning");
  }
}

function clear() {
  input.value = "";
  output.value = "";
  copyButton.disabled = true;
  detectedFormat.textContent = "Hex";
  resultMeta.textContent = "";
  showMessage("粘贴 Hex 格式的 MessagePack 数据");
  input.focus();
}

convertButton.addEventListener("click", convert);
copyButton.addEventListener("click", copyOutput);
clearButton.addEventListener("click", clear);
input.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    convert();
  }
});

if (window.utools?.onPluginEnter) {
  window.utools.onPluginEnter(() => {
    clear();
  });
}

input.focus();
