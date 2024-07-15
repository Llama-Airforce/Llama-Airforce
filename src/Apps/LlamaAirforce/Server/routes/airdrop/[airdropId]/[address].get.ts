import { isAddress } from "viem";
import { isAirdropId } from "@LAF/Services/UnionService";
import { getAirdropClaims } from "@LAF/Server/util/getAirdropClaims";

export type Result = Awaited<ReturnType<typeof handler>>;

const handler = defineEventHandler(async (event) => {
  const { airdropId, address } = getRouterParams(event);

  if (!isAirdropId(airdropId)) {
    throw createError({
      statusCode: 400,
      message: "Invalid airdrop id",
    });
  }

  if (!isAddress(address)) {
    throw createError({
      statusCode: 400,
      message: "Invalid address parameter",
    });
  }

  const claims = await getAirdropClaims(airdropId);
  const claim = claims.claims[address];

  if (!claim) {
    throw createError({
      statusCode: 404,
      message: `Claim for '${address}' not found`,
    });
  }

  return {
    index: claim.index,
    amount: claim.amount,
    proof: claim.proof.map((x) => x as Address) as readonly Address[],
  };
});

export default handler;
