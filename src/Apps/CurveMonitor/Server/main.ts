import { Hono } from "hono";
import cors from "@CM/Server/middleware/cors";

import index from "@CM/Server/routes/index.head";
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
app.use(cors());

app.route("/", index);
app.route("/chains", chain);
app.route("/revenue", revenue);

export default {
  port: 3001,
  fetch: app.fetch,
};
