import { Hono } from "hono";
import cors from "@/Framework/Server/middleware/cors";
import price from "@/Framework/Server/price/main";
import index from "@/Framework/Server/routes/index.head";
import chain from "@CM/Server/routes/chains/[chain].get";
import crvusdweekly from "@CM/Server/routes/revenue/crvusdweekly.get";
import feesCollected from "@CM/Server/routes/revenue/fees-collected.get";
import feesStaged from "@CM/Server/routes/revenue/fees-staged.get";
import pools from "@CM/Server/routes/revenue/pools.get";

// Apps
const app = new Hono();
const revenue = new Hono();

// Revenue
revenue.route("/crvusd/weekly", crvusdweekly);
revenue.route("/pools/weekly", pools);
revenue.route("/collected", feesCollected);
revenue.route("/staged", feesStaged);

// Root
const allowedOrigins = [
  /^http:\/\/localhost(:\d+)?$/,
  /^https:\/\/(.*\.)?curvemonitor\.com$/,
];

app.use(cors(allowedOrigins));

app.route("/", index);
app.route("/v1/chains", chain);
app.route("/v1/dao/fees", revenue);
app.route("/price", price);

export default {
  port: 3001,
  fetch: app.fetch,
};
