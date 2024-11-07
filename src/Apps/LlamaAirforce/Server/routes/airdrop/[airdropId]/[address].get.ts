import { isAddress } from "viem";
import { Hono, HTTPException, type HonoResultOutput } from "@/Framework/Hono";
import type { Address } from "@/Framework/Address";
import { isAirdropId } from "@LAF/Services/UnionService";
import { getAirdropClaims } from "@LAF/Server/util/getAirdropClaims";

const path = "/:airdropId/:address";

const app = new Hono().get(path, async (c) => {
  const airdropId = c.req.param("airdropId");
  const address = c.req.param("address");

  if (!isAirdropId(airdropId)) {
    throw new HTTPException(400, { message: "Invalid airdrop id" });
  }

  if (!isAddress(address)) {
    throw new HTTPException(400, { message: "Invalid address parameter" });
  }

  const claims = await getAirdropClaims(airdropId);
  const claim = claims.claims[address];

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!claim) {
    throw new HTTPException(404, {
      message: `Claim for '${address}' not found`,
    });
  }

  return c.json({
    index: claim.index,
    amount: claim.amount,
    proof: claim.proof.map((x) => x as Address),
  });
});

export type Result = HonoResultOutput<typeof app, typeof path>;
export default app;
