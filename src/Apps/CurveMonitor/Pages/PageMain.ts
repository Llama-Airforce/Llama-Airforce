import { type Page } from "@/Framework/Monitor/Page";

import Home from "@CM/Pages/Home/Home.page.vue";

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

export const pageMainRoutes = [
  { path: "/", component: Home },

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
];

export const pageMain: Page = {
  titleRoute: "/",
  menuItems: [
    {
      label: "Articles",
      url: "https://blog.curvemonitor.com/",
    },
    {
      label: "Platform",
      children: [
        {
          to: "/platform/chains",
          label: "Chains",
        },
        {
          to: "/platform/pools",
          label: "Pools",
          tag: "alpha",
        },
        {
          to: "/platform/revenue",
          label: "Revenue",
        },
        {
          to: "/platform/crvusd",
          label: "crvUSD",
        },
        {
          to: "/platform/lending",
          label: "Lending",
        },
        {
          to: "/platform/monitor",
          label: "Monitor",
          tag: "beta",
        },
      ],
    },
    {
      label: "DAO",
      children: [
        {
          to: "/dao/proposals",
          label: "Proposals",
        },
        {
          to: "/dao/vefunder",
          label: "VeFunder",
        },
      ],
    },
  ],
};
