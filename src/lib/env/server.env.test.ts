import { describe, expect, it } from "vitest";
import { serverEnv } from "./server.env";

function createValidEnv(overrides: Partial<Env> = {}): Env {
  return {
    ADMIN_EMAIL: "admin@example.com",
    BETTER_AUTH_SECRET: "secret",
    BETTER_AUTH_URL: "https://libresensing.com",
    CLOUDFLARE_PURGE_API_TOKEN: "token",
    CLOUDFLARE_ZONE_ID: "zone-id",
    DOMAIN: "libresensing.com",
    GITHUB_CLIENT_ID: "github-client-id",
    GITHUB_CLIENT_SECRET: "github-client-secret",
    ...overrides,
  } as Env;
}

describe("serverEnv", () => {
  it("does not fail the whole site when optional Personal AI Hub URL is malformed", () => {
    const env = serverEnv(
      createValidEnv({
        PERSONAL_AI_HUB_API_URL: "hub-api.libresensing.com",
      }),
    );

    expect(env.PERSONAL_AI_HUB_API_URL).toBe("hub-api.libresensing.com");
  });
});
