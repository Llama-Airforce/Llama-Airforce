import type { RouteRecordRaw } from "vue-router";
declare module "vue-router" {
  interface RouteMeta {
    crumbs?: boolean;
  }
}

import Vaults from "@PM/Pages/Vaults/Vaults.page.vue";
import StabilityPool from "@PM/Pages/Pool/StabilityPool.page.vue";
import Stablecoin from "@PM/Pages/Stablecoin/Stablecoin.page.vue";
import Redemptions from "@PM/Pages/Redemptions/Redemptions.page.vue";
import Liquidations from "@PM/Pages/Liquidations/Liquidations.page.vue";
import Revenue from "@PM/Pages/Revenue/Revenue.page.vue";
import Wrappers from "@PM/Pages/Wrappers/Wrappers.page.vue";
import VePrisma from "@PM/Pages/VePrisma/VePrisma.page.vue";
import Proposals from "@PM/Pages/Proposals/Proposals.page.vue";
import VaultManager from "@PM/Pages/Vaults/VaultManager.page.vue";
import Trove from "@PM/Pages/Vaults/Trove.page.vue";
import Profile from "@PM/Pages/Profile/Profile.page.vue";

export const routes: RouteRecordRaw[] = [
  { path: "/", redirect: { name: "vaults" } },
  { path: "/pool", name: "pool", component: StabilityPool },

  { path: "/stable", name: "stable", component: Stablecoin },
  { path: "/redemptions", name: "redemptions", component: Redemptions },
  { path: "/liquidations", name: "liquidations", component: Liquidations },
  { path: "/revenue", name: "revenue", component: Revenue },
  {
    path: "/vaults",
    name: "vaults",
    component: Vaults,
    meta: { crumbs: true },
  },
  { path: "/wrappers/:tab?", name: "wrappers", component: Wrappers },
  { path: "/veprisma", name: "veprisma", component: VePrisma },
  { path: "/proposals", name: "proposals", component: Proposals },
  { path: "/profile/:addr?", name: "profile", component: Profile },
  {
    path: "/vault/:vaultAddr/:tab?",
    name: "prismavault",
    component: VaultManager,
    meta: { crumbs: true },
  },
  {
    path: "/vault/:vaultAddr/trove/:troveAddr",
    name: "prismatrove",
    component: Trove,
    meta: { crumbs: true },
  },
];
