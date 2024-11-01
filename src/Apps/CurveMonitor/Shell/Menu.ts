import type { Menu } from "@/Framework/Monitor/Shell/Menu";

export const menu: Menu = {
  titleRoute: "/",
  items: [
    {
      label: "Articles",
      url: "https://blog.curvemonitor.com/",
    },
    {
      label: "Profile",
      to: "/profile",
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
          to: "/dao/locks",
          label: "Locks",
        },
        {
          to: "/dao/vefunder",
          label: "VeFunder",
        },
      ],
    },
  ],
};
