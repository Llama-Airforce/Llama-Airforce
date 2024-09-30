import { createI18n } from "vue-i18n";
import App from "@PM/App.vue";
import { routes } from "@PM/Routes";

import { setup } from "../setup";

const { app } = setup(App, {
  plugins: [
    createI18n({
      legacy: false,
      locale: "en",
      fallbackLocale: "en",
    }),
  ],
  routes,
});

app.mount("#app");
