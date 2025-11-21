import type { Menu } from "@/Framework/Monitor/Shell/Menu";

export const menu: Menu = {
  titleRoute: "/",
  items: [
    {
      label: "User",
      to: "/user",
    },
    {
      label: "Platform",
      children: [
        {
          label: "Protocols",
          to: "/platform/protocols",
        },
        {
          label: "Stablecoin",
          to: "/platform/stablecoin",
        },
        {
          label: "Insurance",
          to: "/platform/insurance",
        },
        {
          label: "Savings",
          to: "/platform/savings",
        },
      ],
    },
    {
      label: "DAO",
      children: [
        {
          label: "Proposals",
          to: "/dao/proposals",
        },
        {
          label: "Revenue",
          to: "/dao/revenue",
        },
        {
          label: "Staking",
          to: "/dao/staking",
        },
        {
          label: "Vesting",
          to: "/dao/vesting",
        },
      ],
    },
  ],
};
