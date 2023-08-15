import { type Page } from "@PM/Pages/Page";

import Home from "@PM/Pages/Home/Home.vue";

export const pageMain: Page = {
  titleRoute: "/",
  routes: [{ path: "/", component: Home }],
  menuItems: [
    {
      label: "Platform",
      children: [
        {
          to: "/",
          label: "Home",
        },
      ],
    },
  ],
};
