import { type JsonRpcSigner } from "@ethersproject/providers";
import { getCvxCrvPrice } from "@/Util";
import { CvxCrvFactoryAddress, UnionCrvVaultAddress } from "@/Util/Addresses";
import { CvxCrvFactoryPool__factory, UnionVault__factory } from "@/Contracts";
import { type DefiLlamaService } from "@/Services";
import { getVirtualPrice } from "@Pounders/Util/UnionHelper";

export async function getUCrvPrice(
  llamaService: DefiLlamaService,
  signer: JsonRpcSigner
) {
  const factory = CvxCrvFactoryPool__factory.connect(
    CvxCrvFactoryAddress,
    signer
  );
  const cvxcrv = await getCvxCrvPrice(llamaService, factory)
    .then((x) => x)
    .catch(() => Infinity);

  const utkn = UnionVault__factory.connect(UnionCrvVaultAddress, signer);
  const vp = await getVirtualPrice(utkn);
  const ucrv = cvxcrv * vp;

  return ucrv;
}
