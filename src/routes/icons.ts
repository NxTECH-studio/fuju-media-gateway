import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { createHash } from "node:crypto";
import { bearerAuth } from "../middleware/auth";
import { transformIcon } from "../lib/transform";
import { putObject } from "../lib/r2";

const app = new Hono();

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ID_PATTERN = /^[a-zA-Z0-9_-]{1,64}$/;

app.use(bearerAuth);
app.use(bodyLimit({ maxSize: MAX_UPLOAD_BYTES }));

app.post("/", async (c) => {
  const form = await c.req.formData();
  const file = form.get("file");
  const ownerId = form.get("ownerId");
  const namespace = form.get("namespace");

  if (!(file instanceof File)) {
    return c.json({ error: "file is required" }, 400);
  }
  if (typeof ownerId !== "string" || !ID_PATTERN.test(ownerId)) {
    return c.json({ error: "ownerId must match [a-zA-Z0-9_-]{1,64}" }, 400);
  }
  if (typeof namespace !== "string" || !ID_PATTERN.test(namespace)) {
    return c.json({ error: "namespace must match [a-zA-Z0-9_-]{1,64}" }, 400);
  }

  const input = new Uint8Array(await file.arrayBuffer());
  const hash = createHash("sha256").update(input).digest("hex").slice(0, 16);
  const variants = await transformIcon(input);

  const assets = await Promise.all(
    variants.map(async (v) => {
      const key = `icons/${namespace}/${ownerId}/${hash}.${v.format}`;
      const url = await putObject(key, v.buffer, v.contentType);
      return { format: v.format, url: url, size: v.buffer.byteLength };
    }),
  );

  return c.json({ hash: hash, assets: assets });
});

export default app;
