import { createEnvHelpers } from "@/Framework/Hono";

/** Object containing environment variable keys. */
export const envVarsKeys = {
  dbEndpoint: "DB_ENDPOINT",
  dbKey: "DB_KEY",
  clearCachePassword: "CLEAR_CACHE_PASSWORD",
  alchemyLAF: "LAF_ALCHEMY",
  subgraphKey: "SUBGRAPH_KEY",
} as const;

export const { env, check } = createEnvHelpers(envVarsKeys);
