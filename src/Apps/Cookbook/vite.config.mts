import path from "path";
import { defineConfig, splitVendorChunkPlugin } from "vite";
import vue from "@vitejs/plugin-vue";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import VueRouter from "unplugin-vue-router/vite";
import { autoImport } from "../../vite.base";

export default defineConfig(() => {
  return {
    plugins: [
      VueRouter({
        extensions: [".page.vue"],
        routesFolder: path.resolve(__dirname, "./Pages"),
        dts: path.resolve(__dirname, "typed-router.d.ts"),
        extendRoute(route) {
          // Convert the route path to kebab case
          route.path = route.path
            .split("/")
            .map((segment) =>
              segment.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
            )
            .join("/");
        },
      }),
      vue({ script: { propsDestructure: true } }),
      VueI18nPlugin({
        strictMessage: false,
        escapeHtml: false,
      }),
      splitVendorChunkPlugin(),
      AutoImport(autoImport),
      Components({ dts: true, dirs: ["../../Framework"] }),
    ],
    server: {
      port: 8080,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "../../"),
        "@CB": path.resolve(__dirname, "./"),
      },
    },
    tsconfig: path.resolve(__dirname, "tsconfig.json"),
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
