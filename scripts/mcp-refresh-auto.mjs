// 自动刷新 MCP token 并更新 .mcp.json
import { promises as fs } from "node:fs";
import path from "node:path";

const PROJECT_DIR = path
  .dirname(new URL(import.meta.url).pathname)
  .replace(/^\/([A-Z]:)/, "$1")
  .replace(/\/scripts$/, "");
const TOKENS_PATH = path.join(PROJECT_DIR, "mcp-tokens.json");
const MCP_JSON_PATH = path.join(PROJECT_DIR, ".mcp.json");

async function main() {
  // 1. 读取保存的 token
  const saved = JSON.parse(await fs.readFile(TOKENS_PATH, "utf-8"));
  if (!saved.refresh_token || !saved.client_id) {
    console.error(
      "缺少 refresh_token 或 client 凭证，请先运行 mcp-login-simple.mjs 首次登录",
    );
    process.exit(1);
  }

  // 2. 用 refresh_token 换新 access_token
  const body =
    "grant_type=refresh_token&client_id=" +
    encodeURIComponent(saved.client_id) +
    "&client_secret=" +
    encodeURIComponent(saved.client_secret) +
    "&refresh_token=" +
    encodeURIComponent(saved.refresh_token);

  const res = await fetch("https://libresensing.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Claude-Code/1.0",
    },
    body,
  });

  if (!res.ok) {
    console.error("刷新失败:", await res.text());
    process.exit(1);
  }

  const tokens = await res.json();

  // 3. 保存新 token
  await fs.writeFile(
    TOKENS_PATH,
    JSON.stringify(
      {
        ...saved,
        ...tokens,
        obtained_at: new Date().toISOString(),
      },
      null,
      2,
    ),
  );

  // 4. 更新 .mcp.json
  const mcpConfig = JSON.parse(await fs.readFile(MCP_JSON_PATH, "utf-8"));
  mcpConfig.mcpServers["flare-stack-blog"].headers.Authorization =
    "Bearer " + tokens.access_token;
  await fs.writeFile(MCP_JSON_PATH, JSON.stringify(mcpConfig, null, 2) + "\n");

  console.log(new Date().toISOString() + "  token 刷新成功");
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
