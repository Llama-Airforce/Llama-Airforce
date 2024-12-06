import { resolve } from "path";
import { defineConfig, searchForWorkspaceRoot } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import type { App } from "../../Framework/Apps";
import { autoImport, vueImport } from "../../vite.base";

export default defineConfig(() => {
  const app: App = "cm";

  return {
    define: {
      "import.meta.env.VITE_APP": JSON.stringify(app),
    },
    plugins: [
      vue(),
      vueDevTools({ launchEditor: "cursor" }),
      AutoImport(autoImport),
      Components(vueImport),
    ],
    server: {
      port: 8080,
      fs: {
        allow: [searchForWorkspaceRoot(process.cwd()), "../../Assets"],
      },
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "../../"),
        "@CM": resolve(__dirname, "./"),
      },
    },
  };
});
