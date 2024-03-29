import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import App from "@LAF/App.vue";
import createRouter from "@LAF/Router";
import VueApexCharts from "vue3-apexcharts";
import Notifications from "@kyvg/vue3-notification";

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
const pages = [pageCurve, pageConvex, pageBribes];

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
  .mount("#app");
