import { Hono } from "hono";
import cors from "@/Framework/Server/middleware/cors";
import price from "@/Framework/Server/price/main";
import index from "@/Framework/Server/routes/index.head";

// Apps
const app = new Hono();

// Root
const allowedOrigins = [
  /^http:\/\/localhost(:\d+)?$/,
  /^https:\/\/(.*\.)?hippo\.army$/,
];

app.use(cors(allowedOrigins));

app.route("/", index);
app.route("/price", price);

export default {
  port: 3002,
  fetch: app.fetch,
};
