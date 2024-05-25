import { type JsonRpcSigner } from "@ethersproject/providers";
import { UnionVault__factory } from "@/Contracts";
import { getCvxFxsLpPrice } from "@/Util";
import { UnionFxsVaultAddressV1 } from "@/Util/Addresses";
import { type DefiLlamaService } from "@/Services";
import { getVirtualPrice } from "@Pounders/Util/UnionHelper";

export async function getUFxsPriceV1(
  llamaService: DefiLlamaService,
  signer: JsonRpcSigner
) {
  const cvxfxslp = await getCvxFxsLpPrice(llamaService, signer.provider)
    .then((x) => x)
    .catch(() => Infinity);

  const utkn = UnionVault__factory.connect(UnionFxsVaultAddressV1, signer);
  const vp = await getVirtualPrice(utkn);
  const ufxs = cvxfxslp * vp;

  return ufxs;
}
