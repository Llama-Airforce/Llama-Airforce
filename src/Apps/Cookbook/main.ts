import { createI18n } from "vue-i18n";
import { type RouteRecordRaw } from "vue-router";
import "@/Util/llamadash";
import App from "@CB/App.vue";
import createRouter from "@CB/Router";

import { pageMain, pageMainRoutes } from "@CB/PageMain";
import { usePageStore } from "@/Framework/Stores/PageStore";

import { setup } from "../setup";
import { walletConnect } from "@/Wallet/WalletConnect";

const { app } = setup(App, {
  extraWagmiConnectors: [walletConnect],
  plugins: [
    createI18n({
      legacy: false,
      locale: "en",
      fallbackLocale: "en",
    }),
  ],
});

// Configure pages.
const pages = [pageMain];
const routes: RouteRecordRaw[][] = [pageMainRoutes];

const pageStore = usePageStore();
pageStore.pages = pages;
pageStore.routes = routes;

// Mount the app
const router = createRouter();
app.use(router).mount("#app");
