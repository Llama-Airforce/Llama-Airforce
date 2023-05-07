import { Page } from "@CM/Pages/Page";

import Home from "@CM/Pages/Home/Home.vue";

import Pools from "@CM/Pages/Platform/Pools/Pools.vue";
import Gauges from "@CM/Pages/Platform/Gauges/Gauges.vue";
import Revenue from "@CM/Pages/Platform/Revenue/Revenue.vue";

import Monitor from "@CM/Pages/Pool/Monitor.vue";

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
      path: "/platform/revenue",
      name: "revenue",
      component: Revenue,
    },

    { path: "/pool", redirect: { name: "monitor" } },
    {
      path: "/pool/monitor/:pool?",
      name: "curvemonitor",
      component: Monitor,
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
