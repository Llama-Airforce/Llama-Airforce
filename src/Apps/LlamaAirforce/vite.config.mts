import path from "path";
import process from "process";
import { defineConfig, loadEnv, splitVendorChunkPlugin } from "vite";
import vue from "@vitejs/plugin-vue";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      vue({ script: { propsDestructure: true } }),
      VueI18nPlugin({
        include: path.resolve(__dirname, "../../src/locales/**"),
        strictMessage: false,
        escapeHtml: false,
      }),
      splitVendorChunkPlugin(),
      AutoImport({
        dts: true,
        imports: ["vue", "vue-i18n", "vue-router"],
        eslintrc: {
          enabled: true,
        },
      }),
    ],
    server: {
      port: 8080,
    },
    resolve: {
      alias: {
        // Import mock Union page if not configured.
        "@LAF/Pages/Union/Page":
          env.VITE_UNION === "true"
            ? path.resolve(__dirname, "./Pages/Union/Page")
            : path.resolve(__dirname, "./Pages/PageMock"),
        "@": path.resolve(__dirname, "../../"),
        "@LAF": path.resolve(__dirname, "./"),
        "@Union": path.resolve(__dirname, "./Pages/Union/"),
      },
    },
    build: {
      rollupOptions: {
        plugins: [
          /*
           * Enable rollup polyfills plugin
           * used during production bundling
           */
          rollupNodePolyFill(),
        ],
      },
    },
  };
});
