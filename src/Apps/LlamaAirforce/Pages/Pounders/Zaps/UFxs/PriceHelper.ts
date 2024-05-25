import { type JsonRpcSigner } from "@ethersproject/providers";
import { CurveV2FactoryPool__factory, UnionVault__factory } from "@/Contracts";
import { getCvxFxsLpPrice, getCvxFxsPrice } from "@/Util";
import { type DefiLlamaService } from "@/Services";
import {
  CvxFxsFactoryAddress,
  UnionFxsVaultAddress,
  UnionFxsVaultAddressV1,
} from "@/Util/Addresses";
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
