import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueI18nPlugin  from "@intlify/unplugin-vue-i18n/vite";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";

export default defineConfig(() => {
  return {
    plugins: [vue({ reactivityTransform: true }), VueI18nPlugin()],
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
