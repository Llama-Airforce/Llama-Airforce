import { cors } from "hono/cors";

export default function (allowedOrigins: RegExp[]) {
  return cors({
    origin: (origin) =>
      origin && allowedOrigins.some((pattern) => pattern.test(origin))
        ? origin
        : null,
  });
}
