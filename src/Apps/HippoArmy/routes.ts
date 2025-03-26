import type { RouteRecordRaw } from "vue-router";
declare module "vue-router" {
  interface RouteMeta {
    crumbs?: boolean;
  }
}

export const routes: RouteRecordRaw[] = [
  { path: "/", component: () => import("@HA/pages/home/Home.page.vue") },
  { path: "/code", component: () => import("@HA/pages/Code.page.vue") },
  { path: "/api", component: () => import("@HA/pages/API.page.vue") },

  {
    path: "/profile/:tab?",
    name: "profile",
    component: () => import("@HA/pages/profile/Profile.page.vue"),
    props: (route) => ({
      user: route.query.user || "",
    }),
  },

  {
    path: "/platform",
    redirect: { name: "protocols" },
    children: [
      {
        path: "protocols/:protocolName?",
        name: "protocols",
        meta: { crumbs: true },
        component: () =>
          import("@HA/pages/platform/protocols/Protocols.page.vue"),

        children: [
          {
            path: "pair/:pairId/:pairTab?",
            name: "pair",
            component: () =>
              import("@HA/pages/platform/protocols/pair/Pair.page.vue"),
          },
        ],
      },
      {
        path: "stablecoin",
        name: "stablecoin",
        component: () =>
          import("@HA/pages/platform/stablecoin/Stablecoin.page.vue"),
      },
      {
        path: "insurance",
        name: "insurance",
        component: () =>
          import("@HA/pages/platform/insurance/Insurance.page.vue"),
      },
    ],
  },

  {
    path: "/dao",
    redirect: { name: "proposals" },
    children: [
      {
        path: "proposals",
        name: "proposals",
        component: () => import("@HA/pages/dao/proposals/Proposals.page.vue"),
      },
      {
        path: "proposal/:proposalId",
        name: "proposal",
        component: () => import("@HA/pages/dao/proposals/Proposal.page.vue"),
      },
      {
        path: "revenue",
        name: "revenue",
        component: () => import("@HA/pages/dao/revenue/Revenue.page.vue"),
      },
      {
        path: "staking",
        name: "staking",
        component: () => import("@HA/pages/dao/staking/Staking.page.vue"),
      },
      {
        path: "vesting",
        name: "vesting",
        component: () => import("@HA/pages/dao/vesting/Vesting.page.vue"),
      },
    ],
  },

  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@HA/pages/NotFound.page.vue"),
  },
];
