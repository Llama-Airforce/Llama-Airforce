import App from "@HA/App.vue";
import { routes } from "@HA/Routes";

import { setup } from "../setup";

const { app } = setup(App, { routes });

app.mount("#app");
