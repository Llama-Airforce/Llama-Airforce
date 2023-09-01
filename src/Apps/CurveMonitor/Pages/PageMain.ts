import { type Page } from "@CM/Pages/Page";

import Home from "@CM/Pages/Home/Home.vue";

import Pools from "@CM/Pages/Platform/Pools/Pools.vue";
import Gauges from "@CM/Pages/Platform/Gauges/Gauges.vue";
import Revenue from "@CM/Pages/Platform/Revenue/Revenue.vue";

import CrvUsd from "@CM/Pages/Platform/CrvUsd/CrvUsd.vue";
import CrvUsdMarket from "@CM/Pages/Platform/CrvUsd/Market.vue";

import Monitor from "@CM/Pages/Pool/Monitor/Monitor.vue";
import MEV from "@CM/Pages/Pool/MEV/MEV.vue";

import Proposals from "@CM/Pages/DAO/Proposals/Proposals.vue";
import VeFunder from "@CM/Pages/DAO/VeFunder/VeFunder.vue";

export const pageMain: Page = {
  titleRoute: "/",
  routes: [
    { path: "/", component: Home },

    { path: "/platform", redirect: { name: "revenue" } },
    { path: "/platform/pools", component: Pools },
    { path: "/platform/gauges", component: Gauges },
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

    { path: "/pool", redirect: { name: "monitor" } },
    {
      path: "/pool/monitor/:pool?",
      name: "curvemonitor",
      component: Monitor,
    },
    {
      path: "/pool/mev",
      component: MEV,
    },

    { path: "/dao", redirect: { name: "proposals" } },
    {
      path: "/dao/proposals",
      name: "proposals",
      component: Proposals,
    },
    { path: "/dao/vefunder", component: VeFunder },
  ],
  menuItems: [
    {
      label: "Platform",
      children: [
        {
          to: "/platform/pools",
          label: "Pools",
        },
        {
          to: "/platform/gauges",
          label: "Gauges",
        },
        {
          to: "/platform/revenue",
          label: "Revenue",
        },
        {
          to: "/platform/crvusd",
          label: "crvUSD",
        },
      ],
    },
    {
      label: "Pool",
      children: [
        {
          to: "/pool/monitor",
          label: "Live Monitor",
          tag: "beta",
        },
        {
          to: "/pool/mev",
          label: "MEV",
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
