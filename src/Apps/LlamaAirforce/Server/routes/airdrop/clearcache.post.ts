import { Hono, HTTPException, cacheDelete } from "@/Framework/Hono";
import { env } from "@LAF/Server/helpers/env";
import { GET_AIRDROP_CLAIM } from "@LAF/Server/util/getAirdropClaims";
import { airdropIds } from "@LAF/Services/UnionService";

type Body = {
  password: string;
};

const path = "/clearcache";

const app = new Hono().post(path, async (c) => {
  const { clearCachePassword } = env();

  let body: Body;
  try {
    body = await c.req.json<Body>();
  } catch {
    throw new HTTPException(400, {
      message: "Missing or invalid request body",
    });
  }

  if (body.password !== clearCachePassword) {
    throw new HTTPException(400, { message: "Wrong password" });
  }

  for (const airdropId of airdropIds) {
    cacheDelete(`${GET_AIRDROP_CLAIM}:${airdropId}`);
  }

  return c.text(`Cleared cache for: ${airdropIds.join(", ")}`);
});

export default app;
