import { Hono } from "hono";
import { check as envCheck } from "@LAF/Server/helpers/env";

import cors from "@LAF/Server/middleware/cors";

import index from "@LAF/Server/routes/index.head";
import dashboard from "@LAF/Server/routes/dashboard/[id].get";
import delegations from "@LAF/Server/routes/delegations.post";

import airdropClaim from "@LAF/Server/routes/airdrop/[airdropId]/[address].get";
import airdropClearCache from "@LAF/Server/routes/airdrop/clearcache.post";

import bribesPPRound from "@LAF/Server/routes/bribes/[platform]/[protocol]/[round].get";
import bribesPPRounds from "@LAF/Server/routes/bribes/[platform]/[protocol]/rounds.get";

import pirexRedemptions from "@LAF/Server/routes/pirex/redemptions/[address].get";
import pirexRewards from "@LAF/Server/routes/pirex/rewards/[address].get";

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
pirex.route("/", pirexRedemptions);
pirex.route("/", pirexRewards);

// Root
app.use(cors());

app.route("/", index);
app.route("/delegations", delegations);
app.route("/airdrop", airdrop);
app.route("/bribes", bribes);
app.route("/dashboard", dashboard);
app.route("/pirex", pirex);

export default {
  port: 3000,
  fetch: app.fetch,
};
