import { Hono } from "hono";

import cors from "@/Framework/Server/middleware/cors";
import index from "@/Framework/Server/routes/index.head";
import price from "@/Framework/Server/price/main";

import chain from "@CM/Server/routes/chains/[chain].get";

import crvusdweekly from "@CM/Server/routes/revenue/crvusdweekly.get";
import pools from "@CM/Server/routes/revenue/pools.get";
import feesCollected from "@CM/Server/routes/revenue/fees-collected.get";
import feesStaged from "@CM/Server/routes/revenue/fees-staged.get";

// Apps
const app = new Hono();
const revenue = new Hono();

// Revenue
revenue.route("/crvusdweekly", crvusdweekly);
revenue.route("/pools", pools);
revenue.route("/fees-collected", feesCollected);
revenue.route("/fees-staged", feesStaged);

// Root
const allowedOrigins = [
  /^http:\/\/localhost(:\d+)?$/,
  /^https:\/\/(.*\.)?curvemonitor\.com$/,
];

app.use(cors(allowedOrigins));

app.route("/", index);
app.route("/chains", chain);
app.route("/revenue", revenue);
app.route("/price", price);

export default {
  port: 3001,
  fetch: app.fetch,
};
