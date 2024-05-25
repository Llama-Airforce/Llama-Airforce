import { type JsonRpcSigner } from "@ethersproject/providers";
import { getCvxCrvPriceV2 } from "@/Util";
import {
  CvxCrvFactoryAddressV1,
  UnionCrvVaultAddressV2,
} from "@/Util/Addresses";
import { CurveV1FactoryPool__factory, UnionVault__factory } from "@/Contracts";
import { type DefiLlamaService } from "@/Services";
import { getVirtualPrice } from "@Pounders/Util/UnionHelper";

export async function getUCrvV2Price(
  llamaService: DefiLlamaService,
  signer: JsonRpcSigner
) {
  const factory = CurveV1FactoryPool__factory.connect(
    CvxCrvFactoryAddressV1,
    signer
  );
  const cvxcrv = await getCvxCrvPriceV2(llamaService, factory)
    .then((x) => x)
    .catch(() => Infinity);

  const utkn = UnionVault__factory.connect(UnionCrvVaultAddressV2, signer);
  const vp = await getVirtualPrice(utkn);
  const ucrv = cvxcrv * vp;

  return ucrv;
}
