import { Hono } from "hono";
import cors from "@CM/Server/middleware/cors";

import index from "@CM/Server/routes/index.head";
import chain from "@CM/Server/routes/chains/[chain].get";
import crvusdweekly from "@CM/Server/routes/revenue/crvusdweekly.get";
import pools from "@CM/Server/routes/revenue/pools.get";

const app = new Hono();

app.use(cors());

app.route("/", index);
app.route("/chains", chain);
app.route("/revenue/crvusdweekly", crvusdweekly);
app.route("/revenue/pools", pools);

export default {
  port: 3001,
  fetch: app.fetch,
};
