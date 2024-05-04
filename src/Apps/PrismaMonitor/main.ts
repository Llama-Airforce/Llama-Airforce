import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import { VueQueryPlugin, QueryClient, QueryCache } from "@tanstack/vue-query";
import App from "@PM/App.vue";
import createRouter from "@PM/Router";
import VueApexCharts from "vue3-apexcharts";
import Notifications, { notify } from "@kyvg/vue3-notification";

import { pageMain } from "@PM/Pages/PageMain";
import { usePageStore } from "@PM/Stores";

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

const pageStore = usePageStore();
pageStore.pages = pages;

// Configure TanStack query client.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
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
  .mount("#app");
