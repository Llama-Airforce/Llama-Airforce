import type { RuntimeConfig } from "@CM/nitro.config";

export default defineNitroPlugin(() => {
  console.log("Checking if all expected env vars are set");

  const config = useRuntimeConfig<RuntimeConfig>();
  const requiredVars: string[] = [];

  for (const variable of requiredVars) {
    if (!config[variable]) {
      throw createError({
        message: `${variable} not set in .env file`,
      });
    }
  }

  console.log("All env vars gud");
});
