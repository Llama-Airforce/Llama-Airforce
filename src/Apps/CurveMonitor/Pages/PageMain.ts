import { type Page } from "@/Framework/Monitor/Page";

import Home from "@CM/Pages/Home/Home.vue";

import Pools from "@CM/Pages/Platform/Pools/Pools.vue";
import Gauges from "@CM/Pages/Platform/Gauges/Gauges.vue";
import Revenue from "@CM/Pages/Platform/Revenue/Revenue.vue";

import CrvUsd from "@CM/Pages/Platform/CrvUsd/CrvUsd.vue";
import CrvUsdMarket from "@CM/Pages/Platform/CrvUsd/Market.vue";

import LlamaLend from "@CM/Pages/Platform/LlamaLend/LlamaLend.vue";
import LlamaLendMarket from "@CM/Pages/Platform/LlamaLend/Market.vue";

import Monitor from "@CM/Pages/Pool/Monitor/Monitor.vue";
import MEV from "@CM/Pages/Pool/MEV/MEV.vue";

import Proposals from "@CM/Pages/DAO/Proposals/Proposals.vue";
import Proposal from "@CM/Pages/DAO/Proposals/Proposal.vue";
import VeFunder from "@CM/Pages/DAO/VeFunder/VeFunder.vue";

import ConvexFlyer from "@CM/Pages/Convex/Flyer/Flyer.vue";
import ConvexPools from "@CM/Pages/Convex/Pools/Pools.vue";
import ConvexRevenue from "@CM/Pages/Convex/Revenue/Revenue.vue";

export const pageMainRoutes = [
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
  {
    path: "/dao/proposal/:proposalType/:proposalId",
    component: Proposal,
  },
  { path: "/dao/vefunder", component: VeFunder },

  { path: "/convex", redirect: { name: "flyer" } },
  { path: "/convex/flyer", name: "flyer", component: ConvexFlyer },
  {
    path: "/convex/pools/:pool?",
    name: "convexpools",
    component: ConvexPools,
  },
  {
    path: "/convex/revenue",
    name: "convexrevenue",
    component: ConvexRevenue,
  },
];

export const pageMain: Page = {
  titleRoute: "/",
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
        {
          to: "/platform/lending",
          label: "Lending",
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
    {
      label: "Convex",
      initCollapsed: true,
      children: [
        {
          to: "/convex/flyer",
          label: "Flyer",
        },
        {
          to: "/convex/pools",
          label: "Pools",
        },
        {
          to: "/convex/revenue",
          label: "Revenue",
        },
      ],
    },
  ],
};
