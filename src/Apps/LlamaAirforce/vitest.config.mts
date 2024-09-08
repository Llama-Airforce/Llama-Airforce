import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";
import viteConfig from "./vite.config.mjs";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const viteResolve = viteConfig({ mode }).resolve;

  return {
    test: {
      root: "src/Apps/LlamaAirforce",
      env,
    },
    resolve: viteResolve,
  };
});
