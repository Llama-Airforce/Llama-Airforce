import { createApp, type Plugin } from "vue";
import { createPinia } from "pinia";
import { VueQueryPlugin, QueryClient, QueryCache } from "@tanstack/vue-query";
import Notifications, { notify } from "@kyvg/vue3-notification";
import { hashFn } from "@wagmi/core/query";
import { type CreateConnectorFn, WagmiPlugin } from "@wagmi/vue";
import { createConfig as createConfigWagmi } from "@/Wallet/Wagmi";
import "@/Styles/Util.css";
import "@/Styles/Themes/Base.css";

/** Options for configuring the setup function */
type Options = {
  /** Additional Wagmi connectors to be included in the configuration */
  extraWagmiConnectors?: CreateConnectorFn[];
  plugins?: Plugin[];
};

/**
 * Sets up the Vue application with necessary plugins and configurations
 * @param appRoot - The root component of the Vue application
 * @param options - Additional configuration options
 * @returns An object containing the configured Vue app instance and Pinia store
 */
export function setup(
  appRoot: Parameters<typeof createApp>[0],
  options?: Options
) {
  const app = createApp(appRoot);

  // Add custom plugins.
  for (const plugin of options?.plugins ?? []) {
    app.use(plugin);
  }

  // Add Pinia for state management
  const pinia = createPinia();
  app.use(pinia);

  // Configure TanStack query client
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        queryKeyHashFn: hashFn,
      },
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        // Ignore specific connection-related errors
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
    .use(VueQueryPlugin, { queryClient })
    .use(Notifications)
    .use(WagmiPlugin, {
      config: createConfigWagmi(options?.extraWagmiConnectors),
    });

  return { app, pinia };
}
