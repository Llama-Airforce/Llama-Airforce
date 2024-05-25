import { type JsonRpcSigner } from "@ethersproject/providers";
import {
  CurveV2FactoryPool__factory,
  UnionVaultPirex__factory,
} from "@/Contracts";
import { getPxCvxPrice } from "@/Util";
import { PxCvxFactoryAddress, UnionCvxVaultAddress } from "@/Util/Addresses";
import { type DefiLlamaService } from "@/Services";
import { getVirtualPrice } from "@Pounders/Util/UnionHelper";

export async function getUCvxPrice(
  llamaService: DefiLlamaService,
  signer: JsonRpcSigner
) {
  const factory = CurveV2FactoryPool__factory.connect(
    PxCvxFactoryAddress,
    signer
  );
  const pxcvx = await getPxCvxPrice(llamaService, factory)
    .then((x) => x)
    .catch(() => Infinity);

  const utkn = UnionVaultPirex__factory.connect(UnionCvxVaultAddress, signer);
  const vp = await getVirtualPrice(utkn);
  const ucvx = pxcvx * vp;

  return ucvx;
}
