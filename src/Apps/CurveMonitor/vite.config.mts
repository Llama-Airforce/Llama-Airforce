import path from "path";
import { defineConfig, splitVendorChunkPlugin } from "vite";
import vue from "@vitejs/plugin-vue";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";

export default defineConfig(() => {
  return {
    plugins: [
      vue({ script: { propsDestructure: true } }),
      VueI18nPlugin({
        strictMessage: false,
        escapeHtml: false,
      }),
      splitVendorChunkPlugin(),
    ],
    server: {
      port: 8080,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "../../"),
        "@CM": path.resolve(__dirname, "./"),
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
