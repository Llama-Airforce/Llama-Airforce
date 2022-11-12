import path from "path";
import process from "process";
import { defineConfig, loadEnv } from "vite";
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'url';
import vue from "@vitejs/plugin-vue";
import vueI18n from "@intlify/vite-plugin-vue-i18n";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [vue({ reactivityTransform: true }), vueI18n({
      include: resolve(dirname(fileURLToPath(import.meta.url)), './locales/**'),
    })],
    server: {
      port: 8080,
    },
    resolve: {
      alias: {
        // Import mock Union page if not configured.
        "@/Pages/Union/Page":
          env.VITE_UNION === "true"
            ? path.resolve(__dirname, "./src/Pages/Union/Page")
            : path.resolve(__dirname, "./src/Pages/PageMock"),
        "@": path.resolve(__dirname, "./src"),
        stream: "stream-browserify",
        crypto: "crypto-browserify",
        process: "process/browser",
        os: "os-browserify",
        https: "https-browserify",
        assert: "assert",
        util: "util",
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: "globalThis",
        },
        // Enable esbuild polyfill plugins
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true,
          }),
        ],
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
