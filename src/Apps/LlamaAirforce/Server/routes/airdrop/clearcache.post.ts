import type { RuntimeConfig } from "@LAF/nitro.config";
import { airdropIds } from "@LAF/Services/UnionService";
import { GET_AIRDROP_CLAIM } from "@LAF/Server/util/getAirdropClaims";

type Body = {
  password: string;
};

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig<RuntimeConfig>(event);
  const body = await readBody<Body>(event);

  if (body?.password !== config.clearCachePassword) {
    throw createError({
      statusCode: 400,
      message: "Wrong password",
    });
  }

  const storage = useStorage("cache");

  const removals = airdropIds.map((airdropId) =>
    storage.removeItem(`nitro:functions:${GET_AIRDROP_CLAIM}:${airdropId}.json`)
  );

  await Promise.all(removals);

  return `Cleared cache for: ${airdropIds.join(", ")}`;
});
