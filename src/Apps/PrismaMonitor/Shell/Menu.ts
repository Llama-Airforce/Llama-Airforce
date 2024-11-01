import { type Menu } from "@/Framework/Monitor/Shell/Menu";

import { useSettingsStore } from "@PM/Stores";
import { stableSymbol } from "@PM/Models/Flavor";

import {
  PiggyBank,
  DollarSign,
  Scale,
  Cross,
  Skull,
  Lock,
  Landmark,
  Droplet,
  UserRound,
} from "lucide-vue-next";

export const menu: Menu = {
  titleRoute: "/",
  items: [
    {
      to: "/vaults",
      label: "Vaults",
      icon: PiggyBank,
    },
    {
      to: "/stable",
      label: () => {
        const storeSettings = useSettingsStore();
        return stableSymbol(storeSettings.flavor);
      },
      icon: DollarSign,
    },
    {
      to: "/pool",
      label: "Stability pool",
      icon: Scale,
    },
    {
      to: "/redemptions",
      label: "Redemptions",
      icon: Cross,
    },
    {
      to: "/liquidations",
      label: "Liquidations",
      icon: Skull,
    },
    {
      to: "/veprisma",
      label: "vePRISMA",
      icon: Lock,
    },
    {
      to: "/proposals",
      label: "Proposals",
      icon: Landmark,
    },
    {
      to: "/wrappers",
      label: "ve Wrappers",
      icon: Droplet,
    },
    {
      to: "/profile",
      label: "Profile",
      icon: UserRound,
    },
  ],
};
