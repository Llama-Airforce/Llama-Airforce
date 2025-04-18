import { createI18n } from "vue-i18n";
import type { RouteRecordRaw } from "vue-router";
import { walletConnect } from "@/Utils/Wagmi";
import App from "@LAF/App.vue";
import { pageBribes, pageBribesRoutes } from "@LAF/Pages/Bribes/Page";
import type { Page } from "@LAF/Pages/Page";
import { usePageStore } from "@LAF/Pages/PageStore";
import { pagePirex, pagePirexRoutes } from "@LAF/Pages/Pirex/Page";
import { pagePounders, pagePoundersRoutes } from "@LAF/Pages/Pounders/Page";
import { pageUnion, pageUnionRoutes } from "@LAF/Pages/Union/Page";
import { routes as routesBase } from "@LAF/Routes";
import { safe } from "@wagmi/connectors";
import { coinbaseWallet } from "@wagmi/vue/connectors";
import { setup } from "../setup";

// Configure pages.
const pages: Page[] = [];

const routes: RouteRecordRaw[] = [...routesBase];

// Only add Union if specifically configured to do so.
if (import.meta.env.VITE_UNION === "true") {
  pages.push(pageUnion);
  routes.push(...pageUnionRoutes);
}

pages.push(pagePirex);
pages.push(pagePounders);
pages.push(pageBribes);
routes.push(...pagePoundersRoutes);
routes.push(...pageBribesRoutes);
routes.push(...pagePirexRoutes);

const { app } = setup(App, {
  extraWagmiConnectors: [walletConnect, coinbaseWallet(), safe()],
  plugins: [
    createI18n({
      legacy: false,
      locale: "en",
      fallbackLocale: "en",
    }),
  ],
  routes,
});

// Configure pages
const pageStore = usePageStore();
pageStore.pages = pages;

app.mount("#app");
