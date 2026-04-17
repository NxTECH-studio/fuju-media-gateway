import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import icons from "./routes/icons";

const app = new Hono();

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: allowedOrigins,
    allowMethods: ["POST", "GET", "OPTIONS"],
    allowHeaders: ["Authorization", "Content-Type"],
  }),
);

app.get("/health", (c) => c.json({ ok: true }));
app.route("/icons", icons);

export default {
  port: Number(process.env.PORT ?? 8080),
  fetch: app.fetch,
};
