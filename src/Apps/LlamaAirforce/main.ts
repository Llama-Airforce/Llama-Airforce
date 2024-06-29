import { type RouteRecordRaw } from "vue-router";
import App from "@LAF/App.vue";
import createRouter from "@LAF/Router";

import { pageBribes, pageBribesRoutes } from "@LAF/Pages/Bribes/Page";
import { pagePirexRoutes } from "@LAF/Pages/Pirex/Page";
import { pagePounders, pagePoundersRoutes } from "@LAF/Pages/Pounders/Page";
import { pageUnion, pageUnionRoutes } from "@LAF/Pages/Union/Page";

import { usePageStore } from "@/Framework/Stores/PageStore";
import { type PageLAF } from "@LAF/Pages/Page";
import { setup } from "../setup";

const { app } = setup(App);

// Configure pages.
const pages: PageLAF[] = [];
const routes: RouteRecordRaw[][] = [];

// Only add Union if specifically configured to do so.
if (import.meta.env.VITE_UNION === "true") {
  pages.push(pageUnion);
  routes.push(pageUnionRoutes);
}

pages.push(pagePounders);
pages.push(pageBribes);
routes.push(pagePoundersRoutes);
routes.push(pageBribesRoutes);
routes.push(pagePirexRoutes);

const pageStore = usePageStore<PageLAF>();
pageStore.pages = pages;
pageStore.routes = routes;

// Mount the app
const router = createRouter();
app.use(router).mount("#app");
