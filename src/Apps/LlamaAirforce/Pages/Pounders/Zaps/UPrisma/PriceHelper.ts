import { type JsonRpcSigner } from "@ethersproject/providers";
import { CurveV6FactoryPool__factory, UnionVault__factory } from "@/Contracts";
import { getCvxPrismaPrice } from "@/Util";
import { type DefiLlamaService } from "@/Services";
import {
  CvxPrismaFactoryAddress,
  UnionPrismaVaultAddress,
} from "@/Util/Addresses";
import { getVirtualPrice } from "@Pounders/Util/UnionHelper";

export async function getUPrismaPrice(
  llamaService: DefiLlamaService,
  signer: JsonRpcSigner
) {
  const factory = CurveV6FactoryPool__factory.connect(
    CvxPrismaFactoryAddress,
    signer
  );

  const cvxprisma = await getCvxPrismaPrice(llamaService, factory)
    .then((x) => x)
    .catch(() => Infinity);

  const utkn = UnionVault__factory.connect(UnionPrismaVaultAddress, signer);
  const vp = await getVirtualPrice(utkn);
  const uprisma = cvxprisma * vp;

  return uprisma;
}
