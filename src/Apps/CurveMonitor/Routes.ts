import type { RouteRecordRaw } from "vue-router";
declare module "vue-router" {
  interface RouteMeta {
    crumbs?: boolean;
  }
}

export const routes: RouteRecordRaw[] = [
  { path: "/", component: () => import("@CM/Pages/Home/Home.page.vue") },
  { path: "/code", component: () => import("@CM/Pages/Code.page.vue") },
  { path: "/api", component: () => import("@CM/Pages/API.page.vue") },

  {
    path: "/profile/:tab?",
    name: "profile",
    component: () => import("@CM/Pages/Profile/Profile.page.vue"),
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
        component: () => import("@CM/Pages/Platform/Chains/Chains.page.vue"),
      },

      {
        path: "pools",
        meta: { crumbs: true },

        children: [
          {
            path: ":chain?",
            name: "pools",
            component: () => import("@CM/Pages/Platform/Pools/Pools.page.vue"),
          },
          {
            path: ":chain/:poolAddr/:tab?",
            name: "poolspool",
            component: () => import("@CM/Pages/Platform/Pools/Pool.page.vue"),
          },
        ],
      },

      {
        path: "cross-chain/:tab?",
        name: "cross-chain",
        component: () =>
          import("@CM/Pages/Platform/CrossChain/CrossChain.page.vue"),
      },

      {
        path: "revenue/:tab?",
        name: "revenue",
        component: () => import("@CM/Pages/Platform/Revenue/Revenue.page.vue"),
      },

      {
        path: "crvusd",
        meta: { crumbs: true },

        children: [
          {
            path: "",
            name: "crvusd-overview",
            component: () =>
              import("@CM/Pages/Platform/CrvUsd/CrvUsd.page.vue"),
          },
          {
            path: "market/:marketAddr/:tab?",
            name: "crvusdmarket",
            component: () =>
              import("@CM/Pages/Platform/CrvUsd/Market.page.vue"),
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
            component: () =>
              import("@CM/Pages/Platform/LlamaLend/LlamaLend.page.vue"),
          },
          {
            path: ":chain/:marketAddr/:tab?",
            name: "llamalendmarket",
            component: () =>
              import("@CM/Pages/Platform/LlamaLend/Market.page.vue"),
          },
        ],
      },

      {
        path: "savings",
        component: () => import("@CM/Pages/Platform/Savings/Savings.page.vue"),
      },

      {
        path: "sandwiches",
        component: () =>
          import("@CM/Pages/Platform/Sandwiches/Sandwiches.page.vue"),
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
        component: () => import("@CM/Pages/DAO/Gauges/Gauges.page.vue"),
        meta: { crumbs: true },
      },
      {
        path: "gauge/:gaugeAddr/:tab?",
        name: "gauge",
        component: () => import("@CM/Pages/DAO/Gauges/Gauge.page.vue"),
        meta: { crumbs: true },
      },
      {
        path: "proposals",
        name: "proposals",
        component: () => import("@CM/Pages/DAO/Proposals/Proposals.page.vue"),
      },
      {
        path: "proposal/:proposalType/:proposalId",
        name: "proposal",
        component: () => import("@CM/Pages/DAO/Proposals/Proposal.page.vue"),
      },
      {
        path: "locks",
        component: () => import("@CM/Pages/DAO/Locks/Locks.page.vue"),
      },
      {
        path: "vefunder",
        component: () => import("@CM/Pages/DAO/VeFunder/VeFunder.page.vue"),
      },
    ],
  },

  {
    path: "/defimonitor/:tab?",
    name: "defimonitor",
    component: () => import("@CM/Pages/DefiMonitor/DefiMonitor.page.vue"),
  },

  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@CM/Pages/NotFound.page.vue"),
  },
];
