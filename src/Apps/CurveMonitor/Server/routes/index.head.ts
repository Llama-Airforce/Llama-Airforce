import { Hono } from "@/Framework/Hono";

const app = new Hono();

app.get("/", (c) => {
  return c.body(null);
});

export default app;
