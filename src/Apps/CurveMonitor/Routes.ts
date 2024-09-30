import Home from "@CM/Pages/Home/Home.page.vue";
import Code from "@CM/Pages/Code.page.vue";
import NotFound from "@CM/Pages/NotFound.page.vue";

import Chains from "@CM/Pages/Platform/Chains/Chains.page.vue";
import Pools from "@CM/Pages/Platform/Pools/Pools.page.vue";
import Pool from "@CM/Pages/Platform/Pools/Pool.page.vue";
import Revenue from "@CM/Pages/Platform/Revenue/Revenue.page.vue";

import CrvUsd from "@CM/Pages/Platform/CrvUsd/CrvUsd.page.vue";
import CrvUsdMarket from "@CM/Pages/Platform/CrvUsd/Market.page.vue";

import LlamaLend from "@CM/Pages/Platform/LlamaLend/LlamaLend.page.vue";
import LlamaLendMarket from "@CM/Pages/Platform/LlamaLend/Market.page.vue";

import Monitor from "@CM/Pages/Platform/Monitor/Monitor.page.vue";

import Proposals from "@CM/Pages/DAO/Proposals/Proposals.page.vue";
import Proposal from "@CM/Pages/DAO/Proposals/Proposal.page.vue";
import VeFunder from "@CM/Pages/DAO/VeFunder/VeFunder.page.vue";

import DefiMonitor from "@CM/Pages/DefiMonitor/DefiMonitor.page.vue";

export const routes = [
  { path: "/", component: Home },
  { path: "/code", component: Code },

  { path: "/platform", redirect: { name: "revenue" } },

  {
    path: "/platform/chains/:chain?/:type?",
    name: "chains",
    component: Chains,
  },

  { path: "/platform/pools/:chain?", name: "pools", component: Pools },
  {
    path: "/platform/pools/:chain/:poolAddr/:tab?",
    name: "poolspool",
    component: Pool,
  },

  {
    path: "/platform/revenue/:tab?",
    name: "revenue",
    component: Revenue,
  },

  { path: "/platform/crvusd", name: "crvusd", component: CrvUsd },
  {
    path: "/platform/crvusd/market/:marketAddr/:tab?",
    name: "crvusdmarket",
    component: CrvUsdMarket,
  },

  {
    path: "/platform/lending/:chain?",
    name: "llamalend",
    component: LlamaLend,
  },
  {
    path: "/platform/lending/:chain/:marketAddr/:tab?",
    name: "llamalendmarket",
    component: LlamaLendMarket,
  },

  {
    path: "/platform/monitor",
    name: "monitor",
    component: Monitor,
  },

  { path: "/dao", redirect: { name: "proposals" } },
  {
    path: "/dao/proposals",
    name: "proposals",
    component: Proposals,
  },
  {
    path: "/dao/proposal/:proposalType/:proposalId",
    component: Proposal,
  },
  { path: "/dao/vefunder", component: VeFunder },

  {
    path: "/defimonitor/:tab?",
    name: "defimonitor",
    component: DefiMonitor,
  },

  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];
