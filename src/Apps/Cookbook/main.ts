import { createI18n } from "vue-i18n";
import { safe } from "@wagmi/connectors";
import App from "@CB/App.vue";
import { routes } from "@CB/Routes";

import { setup } from "../setup";
import { walletConnect } from "@/Wallet/WalletConnect";

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
