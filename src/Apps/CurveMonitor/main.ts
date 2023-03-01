import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import App from "@CM/App.vue";
import createRouter from "@CM/Router";
import VueApexCharts from "vue3-apexcharts";
import Notifications from "@kyvg/vue3-notification";

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

// Draw the rest of the owl.
const router = createRouter();
app.use(router)
  .use(VueApexCharts)
  .use(Notifications)
  .mount("#app");
