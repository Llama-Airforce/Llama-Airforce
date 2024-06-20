import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import { type RouteRecordRaw } from "vue-router";
import { VueQueryPlugin, QueryClient, QueryCache } from "@tanstack/vue-query";
import App from "@CB/App.vue";
import createRouter from "@CB/Router";
import VueApexCharts from "vue3-apexcharts";
import Notifications, { notify } from "@kyvg/vue3-notification";
import { hashFn } from "@wagmi/core/query";
import { WagmiPlugin } from "@wagmi/vue";
import { config as wagmiConfig } from "@/Wallet/Wagmi";

import "highlight.js/styles/vs2015.css";
import hljs from "highlight.js/lib/core";
import xml from "highlight.js/lib/languages/xml";
import scss from "highlight.js/lib/languages/scss";
import typescript from "highlight.js/lib/languages/typescript";
import hljsVuePlugin from "@highlightjs/vue-plugin";

hljs.registerLanguage("xml", xml);
hljs.registerLanguage("scss", scss);
hljs.registerLanguage("typescript", typescript);

import { pageMain, pageMainRoutes } from "@CB/PageMain";
import { usePageStore } from "@/Framework/Stores/PageStore";

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
const pages = [pageMain];
const routes: RouteRecordRaw[][] = [pageMainRoutes];

const pageStore = usePageStore();
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
        error.message.includes("w.getAccounts is not a function")
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
  .use(hljsVuePlugin)
  .use(WagmiPlugin, { config: wagmiConfig })
  .mount("#app");
