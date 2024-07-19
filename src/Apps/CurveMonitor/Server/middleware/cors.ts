export default defineEventHandler((event) => {
  const { req, res } = event.node;

  const allowedOrigins = [
    /^http:\/\/localhost(:\d+)?$/,
    /^https:\/\/(.*\.)?curvemonitor\.com$/,
  ];

  const origin = req.headers.origin;

  if (origin && allowedOrigins.some((pattern) => pattern.test(origin))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }
});
