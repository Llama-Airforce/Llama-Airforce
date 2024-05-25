import { type JsonRpcSigner } from "@ethersproject/providers";
import { getAuraBalPrice } from "@/Util";
import { UnionBalVaultAddress } from "@/Util/Addresses";
import { UnionVault__factory } from "@/Contracts";
import type FlyerService from "@/Services/FlyerService";
import { getVirtualPrice } from "@Pounders/Util/UnionHelper";

export async function getUBalPrice(
  flyerService: FlyerService,
  signer: JsonRpcSigner
) {
  const aurabal = await getAuraBalPrice(flyerService)
    .then((x) => x)
    .catch(() => Infinity);

  const utkn = UnionVault__factory.connect(UnionBalVaultAddress, signer);
  const vp = await getVirtualPrice(utkn);
  const ubal = aurabal * vp;

  return ubal;
}
