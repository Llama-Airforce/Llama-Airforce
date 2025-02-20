import { resolve } from "path";
import { defineConfig, loadEnv, searchForWorkspaceRoot } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import type { App } from "../../Types/Apps";
import { autoImport, vueImport } from "../../vite.base";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const app: App = "laf";

  return {
    define: {
      "import.meta.env.VITE_APP": JSON.stringify(app),
    },
    plugins: [
      vue(),
      vueDevTools({ launchEditor: "cursor" }),
      VueI18nPlugin({
        include: resolve(__dirname, "../../src/locales/**"),
        strictMessage: false,
        escapeHtml: false,
      }),
      AutoImport(autoImport),
      Components(vueImport),
      nodePolyfills({
        include: ["buffer"],
        globals: {
          Buffer: true,
        },
      }),
    ],
    server: {
      port: 8080,
      fs: {
        allow: [searchForWorkspaceRoot(process.cwd()), "../../Assets"],
      },
    },
    resolve: {
      alias: {
        // Import mock Union page if not configured.
        "@LAF/Pages/Union/Page":
          env.VITE_UNION === "true"
            ? resolve(__dirname, "./Pages/Union/Page")
            : resolve(__dirname, "./Pages/PageMock"),
        "@": resolve(__dirname, "../../"),
        "@LAF": resolve(__dirname, "./"),
        "@Union": resolve(__dirname, "./Pages/Union/"),
        "@Pounders": resolve(__dirname, "./Pages/Pounders/"),
      },
    },
  };
});
