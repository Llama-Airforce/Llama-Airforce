import { defineEventHandler, createError } from "h3";
import { useRuntimeConfig } from "nitropack/runtime";
import type { RuntimeConfig } from "@LAF/nitro.config";

export default defineEventHandler((event) => {
  const config = useRuntimeConfig<RuntimeConfig>(event);
  const requiredVars = ["dbEndpoint", "dbKey"];

  for (const variable of requiredVars) {
    if (!config[variable]) {
      throw createError({
        statusCode: 500,
        message: `${variable} not set in .env file`,
      });
    }
  }
});
