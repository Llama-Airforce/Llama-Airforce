import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";

export default defineConfig({
  plugins: [vue({reactivityTransform: true})],
  server: {
    port: 8080,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      stream: "stream-browserify",
      crypto: "crypto-browserify",
      process: 'process/browser',
      os: "os-browserify",
      https: "https-browserify",
      assert: "assert",
      util: "util"
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
        rollupNodePolyFill()
      ]
    }
  }
});