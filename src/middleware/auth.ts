import type { MiddlewareHandler } from "hono";

// TODO: replace with real auth once the NxTECH auth platform is ready.
// Keep the signature `(c, next)` so the swap is drop-in.
export const bearerAuth: MiddlewareHandler = async (c, next) => {
  const header = c.req.header("authorization");
  if (!header?.startsWith("Bearer ")) {
    return c.json({ error: "unauthorized" }, 401);
  }

  const token = header.slice("Bearer ".length);
  const allowed = (process.env.API_KEYS ?? "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  if (allowed.length === 0 || !allowed.includes(token)) {
    return c.json({ error: "unauthorized" }, 401);
  }

  await next();
};
