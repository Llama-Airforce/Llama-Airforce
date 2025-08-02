import { createI18n } from "vue-i18n";
import { walletConnect } from "@/Utils/Wagmi";
import App from "@CB/App.vue";
import { routes } from "@CB/Routes";
import { safe } from "@wagmi/connectors";
import { setup } from "../setup";

const { app } = setup(App, {
  extraWagmiConnectors: [walletConnect, safe()],
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
