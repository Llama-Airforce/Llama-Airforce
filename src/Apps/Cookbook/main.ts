import { type RouteRecordRaw } from "vue-router";
import App from "@CB/App.vue";
import createRouter from "@CB/Router";

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
app.use(router).use(hljsVuePlugin).mount("#app");
