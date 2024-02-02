import { type Page } from "@/Framework/Monitor";

import Vaults from "@PM/Pages/Vaults/Vaults.vue";
import StabilityPool from "@PM/Pages/Pool/StabilityPool.vue";
import Stablecoin from "@PM/Pages/Stablecoin/Stablecoin.vue";
import Redemptions from "@PM/Pages/Redemptions/Redemptions.vue";
import Liquidations from "@PM/Pages/Liquidations/Liquidations.vue";
import Revenue from "@PM/Pages/Revenue/Revenue.vue";
import Wrappers from "@PM/Pages/Wrappers/Wrappers.vue";
import VePrisma from "@PM/Pages/VePrisma/VePrisma.vue";
import Proposals from "@PM/Pages/Proposals/Proposals.vue";
import VaultManager from "@PM/Pages/Vaults/VaultManager.vue";
import Trove from "@PM/Pages/Vaults/Trove.vue";
import Profile from "@PM/Pages/Profile/Profile.vue";

export const pageMain: Page = {
  titleRoute: "/",
  routes: [
    { path: "/", redirect: { name: "vaults" } },

    { path: "/pool", name: "pool", component: StabilityPool },
    { path: "/mkusd", name: "mkusd", component: Stablecoin },
    { path: "/redemptions", name: "redemptions", component: Redemptions },
    { path: "/liquidations", name: "liquidations", component: Liquidations },
    { path: "/revenue", name: "revenue", component: Revenue },
    { path: "/vaults", name: "vaults", component: Vaults },
    { path: "/wrappers/:tab?", name: "wrappers", component: Wrappers },
    { path: "/veprisma", name: "veprisma", component: VePrisma },
    { path: "/proposals", name: "proposals", component: Proposals },
    { path: "/profile/:addr?", name: "profile", component: Profile },
    {
      path: "/vault/:vaultAddr/:tab?",
      name: "prismavault",
      component: VaultManager,
    },
    {
      path: "/vault/:vaultAddr/trove/:troveAddr",
      name: "prismatrove",
      component: Trove,
    },
  ],
  menuItems: [
    {
      to: "/vaults",
      label: "Vaults",
      icon: "fas fa-piggy-bank",
    },
    {
      to: "/mkusd",
      label: "mkUSD",
      icon: "fas fa-dollar-sign",
    },
    {
      to: "/pool",
      label: "Stability pool",
      icon: "fas fa-balance-scale",
    },
    {
      to: "/redemptions",
      label: "Redemptions",
      icon: "fas fa-bible",
    },
    {
      to: "/liquidations",
      label: "Liquidations",
      icon: "fas fa-book-dead",
    },
    {
      to: "/veprisma",
      label: "vePRISMA",
      icon: "fas fa-lock",
    },
    {
      to: "/proposals",
      label: "Proposals",
      icon: "fas fa-landmark",
    },
    {
      to: "/wrappers",
      label: "ve Wrappers",
      icon: "fas fa-tint",
    },
    {
      to: "/profile",
      label: "Profile",
      icon: "fas fa-user",
    },
  ],
};
