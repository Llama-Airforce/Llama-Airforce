import { Hono } from "@/Framework/Hono";

const app = new Hono();

app.get("/", (c) => c.body(null));

export default app;
