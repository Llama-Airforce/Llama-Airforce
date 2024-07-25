import { cors } from "hono/cors";

export default function () {
  return cors({
    origin: (origin) => {
      const allowedOrigins = [
        /^http:\/\/localhost(:\d+)?$/,
        /^https:\/\/(.*\.)?curvemonitor\.com$/,
      ];

      return origin && allowedOrigins.some((pattern) => pattern.test(origin))
        ? origin
        : null;
    },
  });
}
