import { Hono } from "hono";
import cors from "@/Framework/Server/middleware/cors";
import price from "@/Framework/Server/price/main";
import index from "@/Framework/Server/routes/index.head";
import { check as envCheck } from "@LAF/Server/helpers/env";
import airdropClaim from "@LAF/Server/routes/airdrop/[airdropId]/[address].get";
import airdropClearCache from "@LAF/Server/routes/airdrop/clearcache.post";
import bribesPPRound from "@LAF/Server/routes/bribes/[platform]/[protocol]/[round].get";
import bribesPPRounds from "@LAF/Server/routes/bribes/[platform]/[protocol]/rounds.get";
import dashboard from "@LAF/Server/routes/dashboard/[id].get";
import delegations from "@LAF/Server/routes/delegations.post";
import pirexFutures from "@LAF/Server/routes/pirex/futures/[address].get";
import pirexRedemptions from "@LAF/Server/routes/pirex/redemptions/[address].get";

envCheck();

// Apps
const app = new Hono();
const airdrop = new Hono();
const bribes = new Hono();
const pirex = new Hono();

// Airdrop
airdrop.route("/", airdropClearCache);
airdrop.route("/", airdropClaim);

// Bribes
bribes.route("/", bribesPPRounds);
bribes.route("/", bribesPPRound);

// Pirex
pirex.route("/", pirexFutures);
pirex.route("/", pirexRedemptions);

// Root
const allowedOrigins = [
  /^http:\/\/localhost(:\d+)?$/,
  /^https:\/\/(.*\.)?llama\.airforce$/,
];

app.use(cors(allowedOrigins));

app.route("/", index);
app.route("/delegations", delegations);
app.route("/airdrop", airdrop);
app.route("/bribes", bribes);
app.route("/dashboard", dashboard);
app.route("/pirex", pirex);
app.route("/price", price);

export default {
  port: 3000,
  fetch: app.fetch,
};
