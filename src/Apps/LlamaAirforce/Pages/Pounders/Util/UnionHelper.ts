import { type JsonRpcProvider } from "@ethersproject/providers";
import { MerkleDistributor2__factory, type UnionVaultUCrv } from "@/Contracts";
import { bigNumToNumber } from "@/Util";
import type UnionService from "@LAF/Services/UnionService";
import type { AirdropId, Claim } from "@LAF/Services/UnionService";
import {
  type Vault,
  getTotalUnderlying,
  getDistributor,
} from "@Pounders/Models";

export async function getClaim(
  provider: JsonRpcProvider,
  unionService: UnionService,
  airdropId: AirdropId,
  address: string
): Promise<Claim | null> {
  if (!provider) {
    return null;
  }

  const respClaim = await unionService.getClaim(airdropId, address);
  const claim = respClaim?.success ? respClaim.claim : null;
  if (!claim) {
    return null;
  }

  const distributorInfo = getDistributor(airdropId);
  const distributor = MerkleDistributor2__factory.connect(
    distributorInfo.address,
    provider
  );

  const isFrozen = await distributor.frozen();
  const isClaimed = await distributor.isClaimed(claim.index);

  return isFrozen || isClaimed ? null : claim;
}

export async function getVirtualPrice(
  utkn: Vault | UnionVaultUCrv
): Promise<number> {
  const dec = 10n ** 18n;
  const totalUnderlying = await getTotalUnderlying(utkn);
  const tvl = await utkn.totalSupply().then((x) => x.toBigInt());

  return tvl > 0n ? bigNumToNumber((totalUnderlying * dec) / tvl, 18n) : 1;
}
