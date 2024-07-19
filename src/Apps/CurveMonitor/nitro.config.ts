import { type NitroRuntimeConfig } from "nitropack";
import { defineNitroConfig } from "nitropack/config";
import { resolve } from "path";

const runtimeConfig = {};

export type RuntimeConfig = {
  [K in keyof typeof runtimeConfig]: NonNullable<(typeof runtimeConfig)[K]>;
} & NitroRuntimeConfig;

export default defineNitroConfig({
  rootDir: __dirname,
  srcDir: resolve(__dirname, "Server"),
  runtimeConfig,
  alias: {
    "@": resolve(__dirname, "../../"),
    "@CM": resolve(__dirname, "./"),
  },
});
