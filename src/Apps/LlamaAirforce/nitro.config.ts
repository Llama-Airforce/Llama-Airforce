import { defineNitroConfig } from "nitropack/config";
import { resolve } from "path";

export default defineNitroConfig({
  srcDir: resolve(__dirname, "Server"),
});
