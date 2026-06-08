import crypto from "node:crypto";
import { createServer } from "node:http";

type OAuthClientRegistrationResponse = {
  client_id: string;
  client_secret: string;
};

// Base64URLEncode helper
function base64URLEncode(str: Buffer): string {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function sha256(buffer: Buffer): Buffer {
  return crypto.createHash("sha256").update(buffer).digest();
}

async function main() {
  console.log("Registering OAuth client...");
  const redirectUri = "http://localhost:3005/callback";

  // 1. Dynamic Client Registration
  const regRes = await fetch("https://libresensing.com/oauth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_name: "Copilot Auto-Auth Script",
      redirect_uris: [redirectUri],
      token_endpoint_auth_method: "client_secret_basic",
    }),
  });

  if (!regRes.ok) {
    console.error("Failed to register client:", await regRes.text());
    process.exit(1);
  }

  const client = (await regRes.json()) as OAuthClientRegistrationResponse;
  console.log("Registered client ID:", client.client_id);

  // 2. PKCE setup (code_verifier must be a string)
  const codeVerifier = base64URLEncode(crypto.randomBytes(32));
  const codeChallenge = base64URLEncode(sha256(Buffer.from(codeVerifier)));
  const state = crypto.randomBytes(16).toString("hex");

  const scopes =
    "openid profile email offline_access analytics:read posts:read posts:write comments:read comments:write media:read media:write friend-links:read friend-links:write personal-ai-hub:read";

  // 3. Start local server
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
          res.end("No code provided");
          return;
        }

        console.log("Got authorization code, exchanging for token...");

        // 4. Token exchange
        const tokenRes = await fetch("https://libresensing.com/oauth/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Copilot-Script/1.0",
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: client.client_id,
            client_secret: client.client_secret,
            code: code,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier,
          }),
        });

        if (!tokenRes.ok) {
          res.writeHead(400);
          res.end("Failed to exchange token: " + (await tokenRes.text()));
          return;
        }

        const tokens = await tokenRes.json();

        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(
          `<h1>授权成功！</h1><p>请返回编辑器。已成功获取 Access Token。</p><script>window.close()</script>`,
        );

        console.log("\n=========================================");
        console.log("ACCESS_TOKEN_JSON:\n" + JSON.stringify(tokens, null, 2));
        console.log("=========================================\n");

        server.close();
        process.exit(0);
      }
    } catch (err) {
      console.error(err);
      res.writeHead(500);
      res.end("Internal error");
    }
  });

  server.listen(3005, () => {
    const authUrl = `https://libresensing.com/oauth/consent?client_id=${client.client_id}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes)}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

    console.log("Server listening on port 3005.");
    console.log("\n=======================================================");
    console.log("请复制以下链接到浏览器中打开并进行授权：");
    console.log(authUrl);
    console.log("=======================================================\n");
    console.log("等待回调响应中...");
  });
}

main().catch(console.error);
