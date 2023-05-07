import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import App from "@LAF/App.vue";
import createRouter from "@LAF/Router";
import VueApexCharts from "vue3-apexcharts";
import Notifications from "@kyvg/vue3-notification";

import "highlight.js/styles/vs2015.css";
import hljs from "highlight.js/lib/core";
import xml from "highlight.js/lib/languages/xml";
import scss from "highlight.js/lib/languages/scss";
import typescript from "highlight.js/lib/languages/typescript";
import hljsVuePlugin from "@highlightjs/vue-plugin";

hljs.registerLanguage('xml', xml);
hljs.registerLanguage('scss', scss);
hljs.registerLanguage('typescript', typescript);

import { pageCookbook } from "@LAF/Pages/PageCookbook";
import { pageCurve } from "@LAF/Pages/Curve/Page";
import { pageConvex } from "@LAF/Pages/Convex/Page";
import { pageBribes } from "@LAF/Pages/Bribes/Page";
import { pageUnion } from "@LAF/Pages/Union/Page";
import { usePageStore } from "@LAF/Pages/Store";

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
const pages = [pageCookbook, pageCurve, pageConvex, pageBribes];

// Only add Union if specifically configured to do so.
if (import.meta.env.VITE_UNION === "true") {
  pages.push(pageUnion);
}

const pageStore = usePageStore();
pageStore.pages = pages;

// Draw the rest of the owl.
const router = createRouter();
app.use(router)
  .use(VueApexCharts)
  .use(Notifications)
  .use(hljsVuePlugin)
  .mount("#app");
