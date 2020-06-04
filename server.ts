import { Application, isHttpError } from "https://deno.land/x/oak/mod.ts";
import {
  green,
  cyan,
  bold,
  yellow,
} from "https://deno.land/std@0.56.0/fmt/colors.ts";

import router from "./routes.ts"
const PORT = 8182

const app = new Application();
// Logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(
    `${green(ctx.request.method)} ${cyan(ctx.request.url.pathname)} - ${
      bold(
        String(rt),
      )
    }`,
  );
});

// Response Time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

// Error handler
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (isHttpError(err)) {
      ctx.response.status = err.status;
      const { message, status, stack } = err;
      if (ctx.request.accepts("json")) {
        ctx.response.body = { message, status, stack };
        ctx.response.type = "json";
      } else {
        ctx.response.body = `${status} ${message}\n\n${stack ?? ""}`;
        ctx.response.type = "text/plain";
      }
    } else {
      console.log(err);
      throw err;
    }
  }
});

// Use the router
app.use(router.routes());
app.use(router.allowedMethods());


console.log(`app running at 127.0.0.1:${PORT}`)

await app.listen(`127.0.0.1:${PORT}`)