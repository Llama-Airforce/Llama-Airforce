import { type JsonRpcSigner } from "@ethersproject/providers";
import { CurveV2FactoryPool__factory, UnionVault__factory } from "@/Contracts";
import { getCvxFxsPrice } from "@/Util";
import { type DefiLlamaService } from "@/Services";
import { CvxFxsFactoryAddress, UnionFxsVaultAddress } from "@/Util/Addresses";
import { getVirtualPrice } from "@Pounders/Util/UnionHelper";

export async function getUFxsPrice(
  llamaService: DefiLlamaService,
  signer: JsonRpcSigner
) {
  const factory = CurveV2FactoryPool__factory.connect(
    CvxFxsFactoryAddress,
    signer
  );

  const cvxfxs = await getCvxFxsPrice(llamaService, factory)
    .then((x) => x)
    .catch(() => Infinity);

  const utkn = UnionVault__factory.connect(UnionFxsVaultAddress, signer);
  const vp = await getVirtualPrice(utkn);
  const ufxs = cvxfxs * vp;

  return ufxs;
}
