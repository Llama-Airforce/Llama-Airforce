export default defineEventHandler((event) => {
  event.node.res.setHeader("Content-Type", "text/plain");
  event.node.res.setHeader("Content-Length", "0");
  return null;
});
