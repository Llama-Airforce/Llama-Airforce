import { createI18n } from "vue-i18n";
import { type RouteRecordRaw } from "vue-router";
import "@/Util/llamadash";
import App from "@PM/App.vue";
import createRouter from "@PM/Router";

import { pageMain, pageMainRoutes } from "@PM/Pages/PageMain";
import { setup } from "../setup";

const { app } = setup(App, {
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
