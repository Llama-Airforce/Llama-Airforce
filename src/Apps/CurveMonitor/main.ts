import App from "@CM/App.vue";
import { routes } from "@CM/Routes";

import { setup } from "../setup";

const { app } = setup(App, { routes });

app.mount("#app");
