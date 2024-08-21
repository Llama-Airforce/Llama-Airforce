import { resolve } from "path";
import { defineConfig, splitVendorChunkPlugin } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import type { App } from "../../Framework/Apps";
import { autoImport } from "../../vite.base";

export default defineConfig(() => {
  const app: App = "cm";

  return {
    define: {
      "import.meta.env.VITE_APP": JSON.stringify(app),
    },
    plugins: [
      vue({ features: { propsDestructure: true } }),
      vueDevTools({ launchEditor: "cursor" }),
      splitVendorChunkPlugin(),
      AutoImport(autoImport),
      Components({ dts: true, dirs: ["../../Framework"] }),
    ],
    server: {
      port: 8080,
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "../../"),
        "@CM": resolve(__dirname, "./"),
      },
    },
  };
});
