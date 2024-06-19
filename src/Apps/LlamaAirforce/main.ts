import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import { type RouteRecordRaw } from "vue-router";
import { VueQueryPlugin, QueryClient, QueryCache } from "@tanstack/vue-query";
import App from "@LAF/App.vue";
import createRouter from "@LAF/Router";
import VueApexCharts from "vue3-apexcharts";
import Notifications, { notify } from "@kyvg/vue3-notification";
import { hashFn } from "@wagmi/core/query";
import { WagmiPlugin } from "@wagmi/vue";
import { config as wagmiConfig } from "@/Wallet/Wagmi";

import { pageBribes, pageBribesRoutes } from "@LAF/Pages/Bribes/Page";
import { pagePirexRoutes } from "@LAF/Pages/Pirex/Page";
import { pagePounders, pagePoundersRoutes } from "@LAF/Pages/Pounders/Page";
import { pageUnion, pageUnionRoutes } from "@LAF/Pages/Union/Page";

import { usePageStore } from "@/Framework/Stores/PageStore";
import { type PageLAF } from "@LAF/Pages/Page";

const app = createApp(App);

// Add i18n.
const i18n = createI18n({
  legacy: false, // Needed for composition API.
  locale: "en",
  fallbackLocale: "en",
});
app.use(i18n);

// Add pinia.
const pinia = createPinia();
app.use(pinia);

// Configure pages.
const pages: PageLAF[] = [];
const routes: RouteRecordRaw[][] = [];

// Only add Union if specifically configured to do so.
if (import.meta.env.VITE_UNION === "true") {
  pages.push(pageUnion);
  pages.push(pagePounders);
  routes.push(pageUnionRoutes);
  routes.push(pagePoundersRoutes);
}

pages.push(pageBribes);
routes.push(pageBribesRoutes);
routes.push(pagePirexRoutes);

const pageStore = usePageStore<PageLAF>();
pageStore.pages = pages;
pageStore.routes = routes;

// Configure TanStack query client.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      queryKeyHashFn: hashFn,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Ignore these wagmi errors for now.
      if (
        error.message.includes("Connector not connected") ||
        error.message.includes("connector2.getAccounts is not a function") ||
        error.message.includes("w.getAccount is not a function")
      ) {
        return;
      }

      notify({
        text: `Failed querying ${query.queryHash} >>> ${error.message}`,
        type: "error",
      });
    },
  }),
});

// Draw the rest of the owl.
const router = createRouter();
app
  .use(router)
  .use(VueApexCharts)
  .use(VueQueryPlugin, { queryClient })
  .use(Notifications)
  .use(WagmiPlugin, { config: wagmiConfig })
  .mount("#app");
