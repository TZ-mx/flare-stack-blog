import crypto from "node:crypto";
import { createServer } from "node:http";

function base64URLEncode(str) {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest();
}

async function main() {
  // 支持 --refresh 参数直接刷新 token
  if (process.argv.includes("--refresh")) {
    const saved = JSON.parse(await fs.readFile("mcp-tokens.json", "utf-8"));
    console.log("刷新 access token...");
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
    await fs.writeFile(
      "mcp-tokens.json",
      JSON.stringify(
        { ...saved, ...tokens, obtained_at: new Date().toISOString() },
        null,
        2,
      ),
    );
    console.log("新 ACCESS TOKEN:");
    console.log(tokens.access_token);
    process.exit(0);
  }

  const redirectUri = "http://localhost:3005/callback";

  // 1. 注册 OAuth 客户端
  console.log("注册 OAuth 客户端...");
  const regRes = await fetch("https://libresensing.com/oauth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_name: "Claude Code MCP",
      redirect_uris: [redirectUri],
      token_endpoint_auth_method: "client_secret_basic",
    }),
  });
  if (!regRes.ok) {
    console.error("注册失败:", await regRes.text());
    process.exit(1);
  }
  const client = await regRes.json();
  console.log("客户端 ID:", client.client_id);

  // 2. PKCE
  const codeVerifier = base64URLEncode(crypto.randomBytes(32));
  const codeChallenge = base64URLEncode(sha256(Buffer.from(codeVerifier)));
  const state = crypto.randomBytes(16).toString("hex");
  const scopes =
    "openid profile email offline_access analytics:read posts:read posts:write comments:read comments:write media:read media:write friend-links:read friend-links:write personal-ai-hub:read";

  // 3. 启动本地服务器
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url || "", "http://localhost:3005");
      if (url.pathname === "/callback") {
        const code = url.searchParams.get("code");
        const respState = url.searchParams.get("state");
        if (respState !== state) {
          res.writeHead(400);
          res.end("State mismatch");
          return;
        }
        if (!code) {
          res.writeHead(400);
          res.end("No code");
          return;
        }
        console.log("收到授权码，正在换取 token...");
        const tokenRes = await fetch("https://libresensing.com/oauth/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Claude-Code/1.0",
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: client.client_id,
            client_secret: client.client_secret,
            code,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier,
          }),
        });
        if (!tokenRes.ok) {
          res.writeHead(400);
          res.end("Token exchange failed: " + (await tokenRes.text()));
          return;
        }
        const tokens = await tokenRes.json();
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(
          "<h1>授权成功!</h1><p>请返回 Claude Code。</p><script>window.close()</script>",
        );
        console.log("\n========== ACCESS TOKEN ==========");
        console.log(tokens.access_token);
        console.log("==================================\n");
        console.log("完整 token 和客户端信息已保存到 mcp-tokens.json");
        await fs.writeFile(
          "mcp-tokens.json",
          JSON.stringify(
            {
              ...tokens,
              client_id: client.client_id,
              client_secret: client.client_secret,
              obtained_at: new Date().toISOString(),
            },
            null,
            2,
          ),
        );
        server.close();
        process.exit(0);
      }
    } catch (err) {
      console.error(err);
      res.writeHead(500);
      res.end("Error");
    }
  });

  server.listen(3005, () => {
    const authUrl = `https://libresensing.com/oauth/consent?client_id=${client.client_id}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes)}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
    console.log("\n=======================================================");
    console.log("请复制以下链接在浏览器中打开并授权：");
    console.log(authUrl);
    console.log("=======================================================\n");
  });
}

import { promises as fs } from "node:fs";

main().catch(console.error);
