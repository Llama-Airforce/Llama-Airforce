import { type RouteRecordRaw } from "vue-router";
import "@/Util/llamadash";
import App from "@CB/App.vue";
import createRouter from "@CB/Router";

import { pageMain, pageMainRoutes } from "@CB/PageMain";
import { usePageStore } from "@/Framework/Stores/PageStore";
import { setup } from "../setup";

const { app } = setup(App);

// Configure pages.
const pages = [pageMain];
const routes: RouteRecordRaw[][] = [pageMainRoutes];

const pageStore = usePageStore();
pageStore.pages = pages;
pageStore.routes = routes;

// Mount the app
const router = createRouter();
app.use(router).mount("#app");
