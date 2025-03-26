import App from "@HA/app.vue";
import { routes } from "@HA/routes";
import { setup } from "../setup";

const { app } = setup(App, { routes });

app.mount("#app");
