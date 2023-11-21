import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import App from "@PM/App.vue";
import createRouter from "@PM/Router";
import VueApexCharts from "vue3-apexcharts";
import Notifications from "@kyvg/vue3-notification";

import { pageMain } from "@PM/Pages/PageMain";
import { usePageStore } from "@PM/Stores";

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
const pages = [pageMain];

const pageStore = usePageStore();
pageStore.pages = pages;

// Draw the rest of the owl.
const router = createRouter();
app.use(router)
  .use(VueApexCharts)
  .use(Notifications)
  .mount("#app");
