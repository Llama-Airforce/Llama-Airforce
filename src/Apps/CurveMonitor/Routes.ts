import type { RouteRecordRaw } from "vue-router";
declare module "vue-router" {
  interface RouteMeta {
    crumbs?: boolean;
  }
}

import Home from "@CM/Pages/Home/Home.page.vue";
import Code from "@CM/Pages/Code.page.vue";
import API from "@CM/Pages/API.page.vue";
import NotFound from "@CM/Pages/NotFound.page.vue";

import Profile from "@CM/Pages/Profile/Profile.page.vue";

import Chains from "@CM/Pages/Platform/Chains/Chains.page.vue";
import Pools from "@CM/Pages/Platform/Pools/Pools.page.vue";
import Pool from "@CM/Pages/Platform/Pools/Pool.page.vue";
import Revenue from "@CM/Pages/Platform/Revenue/Revenue.page.vue";

import CrvUsd from "@CM/Pages/Platform/CrvUsd/CrvUsd.page.vue";
import CrvUsdMarket from "@CM/Pages/Platform/CrvUsd/Market.page.vue";

import LlamaLend from "@CM/Pages/Platform/LlamaLend/LlamaLend.page.vue";
import LlamaLendMarket from "@CM/Pages/Platform/LlamaLend/Market.page.vue";

import Oracles from "@CM/Pages/Platform/Oracles/Oracles.page.vue";

import Savings from "@CM/Pages/Platform/Savings/Savings.page.vue";
import Sandwiches from "@CM/Pages/Platform/Sandwiches/Sandwiches.page.vue";

import Gauges from "@CM/Pages/DAO/Gauges/Gauges.page.vue";
import Gauge from "@CM/Pages/DAO/Gauges/Gauge.page.vue";
import Proposals from "@CM/Pages/DAO/Proposals/Proposals.page.vue";
import Proposal from "@CM/Pages/DAO/Proposals/Proposal.page.vue";
import Locks from "@CM/Pages/DAO/Locks/Locks.page.vue";
import VeFunder from "@CM/Pages/DAO/VeFunder/VeFunder.page.vue";

import DefiMonitor from "@CM/Pages/DefiMonitor/DefiMonitor.page.vue";

export const routes: RouteRecordRaw[] = [
  { path: "/", component: Home },
  { path: "/code", component: Code },
  { path: "/api", component: API },

  {
    path: "/profile/:tab?",
    name: "profile",
    component: Profile,
    props: (route) => ({
      user: route.query.user || "",
      chain: route.query.chain || "",
    }),
  },

  {
    path: "/platform",
    redirect: { name: "revenue" },

    children: [
      {
        path: "chains/:chain?/:type?",
        name: "chains",
        component: Chains,
      },

      {
        path: "pools",
        meta: { crumbs: true },

        children: [
          {
            path: ":chain?",
            name: "pools",
            component: Pools,
          },
          {
            path: ":chain/:poolAddr/:tab?",
            name: "poolspool",
            component: Pool,
          },
        ],
      },

      {
        path: "oracles",
        name: "oracles",
        component: Oracles,
      },

      {
        path: "revenue/:tab?",
        name: "revenue",
        component: Revenue,
      },

      {
        path: "crvusd",
        meta: { crumbs: true },

        children: [
          {
            path: "",
            name: "crvusd-overview",
            component: CrvUsd,
          },
          {
            path: "market/:marketAddr/:tab?",
            name: "crvusdmarket",
            component: CrvUsdMarket,
          },
        ],
      },

      {
        path: "lending",
        meta: { crumbs: true },

        children: [
          {
            path: ":chain?",
            name: "llamalend",
            component: LlamaLend,
          },
          {
            path: ":chain/:marketAddr/:tab?",
            name: "llamalendmarket",
            component: LlamaLendMarket,
          },
        ],
      },

      {
        path: "savings",
        component: Savings,
      },

      {
        path: "sandwiches",
        component: Sandwiches,
      },
    ],
  },

  {
    path: "/dao",
    redirect: { name: "proposals" },

    children: [
      {
        path: "gauges",
        name: "gauges",
        component: Gauges,
        meta: { crumbs: true },
      },
      {
        path: "gauge/:gaugeAddr/:tab?",
        name: "gauge",
        component: Gauge,
        meta: { crumbs: true },
      },
      {
        path: "proposals",
        name: "proposals",
        component: Proposals,
      },
      {
        path: "proposal/:proposalType/:proposalId",
        name: "proposal",
        component: Proposal,
      },
      {
        path: "locks",
        component: Locks,
      },
      {
        path: "vefunder",
        component: VeFunder,
      },
    ],
  },

  {
    path: "/defimonitor/:tab?",
    name: "defimonitor",
    component: DefiMonitor,
  },

  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];
