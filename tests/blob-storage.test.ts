import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdir, writeFile, rm } from "fs/promises";
import path from "path";

describe("blob-storage", () => {
  const envBackup = { ...process.env };

  beforeEach(() => {
    process.env = { ...envBackup };
  });

  afterEach(() => {
    process.env = envBackup;
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("isBlobStorageEnabled is false without STORAGE_*", async () => {
    delete process.env.STORAGE_ENDPOINT;
    delete process.env.STORAGE_BUCKET;
    delete process.env.STORAGE_PROVIDER;
    const { isBlobStorageEnabled, isBlobReadCanaryEnabled } = await import("@/lib/blob-storage");
    expect(isBlobStorageEnabled()).toBe(false);
    expect(isBlobReadCanaryEnabled()).toBe(false);
  });

  it("isBlobReadCanaryEnabled requires STORAGE_READ_CANARY=1", async () => {
    process.env.STORAGE_ENDPOINT = "https://s3.example.com";
    process.env.STORAGE_BUCKET = "proofs";
    const { isBlobStorageEnabled, isBlobReadCanaryEnabled } = await import("@/lib/blob-storage");
    expect(isBlobStorageEnabled()).toBe(true);
    expect(isBlobReadCanaryEnabled()).toBe(false);
    process.env.STORAGE_READ_CANARY = "1";
    vi.resetModules();
    const mod = await import("@/lib/blob-storage");
    expect(mod.isBlobReadCanaryEnabled()).toBe(true);
  });

  it("getPrivateFile reads from S3 when canary enabled", async () => {
    process.env.STORAGE_ENDPOINT = "https://s3.example.com";
    process.env.STORAGE_BUCKET = "proofs";
    process.env.STORAGE_ACCESS_KEY = "test-key";
    process.env.STORAGE_READ_CANARY = "1";

    const payload = Buffer.from("hello-s3");
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string, init?: RequestInit) => {
        expect(url).toBe("https://s3.example.com/proofs/topup-proofs/x.jpg");
        expect(init?.headers).toMatchObject({
          Authorization: "Bearer test-key",
        });
        return new Response(payload, { status: 200 });
      })
    );

    const { getPrivateFile } = await import("@/lib/blob-storage");
    const buf = await getPrivateFile("topup-proofs/x.jpg");
    expect(buf.equals(payload)).toBe(true);
  });

  it("getPrivateFile falls back to local disk without canary", async () => {
    delete process.env.STORAGE_READ_CANARY;
    const key = "e2e-test/local-proof.txt";
    const full = path.join(process.cwd(), "storage", key);
    await mkdir(path.dirname(full), { recursive: true });
    await writeFile(full, "local-ok");
    try {
      const { getPrivateFile } = await import("@/lib/blob-storage");
      const buf = await getPrivateFile(key);
      expect(buf.toString()).toBe("local-ok");
    } finally {
      await rm(path.join(process.cwd(), "storage", "e2e-test"), {
        recursive: true,
        force: true,
      });
    }
  });

  it("storePrivateFile PUTs to S3 when configured", async () => {
    process.env.STORAGE_ENDPOINT = "https://s3.example.com";
    process.env.STORAGE_BUCKET = "proofs";
    process.env.STORAGE_ACCESS_KEY = "test-key";

    const put = vi.fn(async () => new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", put);

    const { storePrivateFile } = await import("@/lib/blob-storage");
    const url = await storePrivateFile("proofs/a.png", Buffer.from("x"), "image/png");
    expect(url).toBe("/api/storage/proofs%2Fa.png");
    expect(put).toHaveBeenCalledWith(
      "https://s3.example.com/proofs/proofs/a.png",
      expect.objectContaining({ method: "PUT" })
    );
  });
});
