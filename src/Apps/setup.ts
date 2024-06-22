import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import { VueQueryPlugin, QueryClient, QueryCache } from "@tanstack/vue-query";
import VueApexCharts from "vue3-apexcharts";
import Notifications, { notify } from "@kyvg/vue3-notification";
import { hashFn } from "@wagmi/core/query";
import { WagmiPlugin } from "@wagmi/vue";
import { config as wagmiConfig } from "@/Wallet/Wagmi";

export function setup(appRoot: Parameters<typeof createApp>[0]) {
  const app = createApp(appRoot);

  // Add i18n
  const i18n = createI18n({
    legacy: false,
    locale: "en",
    fallbackLocale: "en",
  });
  app.use(i18n);

  // Add pinia
  const pinia = createPinia();
  app.use(pinia);

  // Configure TanStack query client
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        queryKeyHashFn: hashFn,
      },
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (
          error.message.includes("Connector not connected") ||
          error.message.includes("connector2.getAccounts is not a function") ||
          error.message.includes("getAccounts is not a function")
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

  // Setup router and other plugins
  app
    .use(VueApexCharts)
    .use(VueQueryPlugin, { queryClient })
    .use(Notifications)
    .use(WagmiPlugin, { config: wagmiConfig });

  return { app, pinia };
}
