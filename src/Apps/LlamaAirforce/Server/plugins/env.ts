import type { RuntimeConfig } from "@LAF/nitro.config";

export default defineNitroPlugin(() => {
  console.log("Checking if all expected env vars are set");

  const config = useRuntimeConfig<RuntimeConfig>();
  const requiredVars = [
    "dbEndpoint",
    "dbKey",
    "clearCachePassword",
    "alchemyLAF",
  ];

  for (const variable of requiredVars) {
    if (!config[variable]) {
      throw createError({
        message: `${variable} not set in .env file`,
      });
    }
  }

  console.log("All env vars gud");
});
