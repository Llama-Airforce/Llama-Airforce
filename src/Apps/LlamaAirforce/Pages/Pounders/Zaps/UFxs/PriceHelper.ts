import { type PublicClient, getContract } from "viem";
import { type JsonRpcSigner } from "@ethersproject/providers";
import { abi as abiUnionVault } from "@/ABI/Union/UnionVault";
import { CurveV2FactoryPool__factory, UnionVault__factory } from "@/Contracts";
import { getCvxFxsPrice, getCvxFxsPriceViem } from "@/Util";
import { type DefiLlamaService } from "@/Services";
import { CvxFxsFactoryAddress, UnionFxsVaultAddress } from "@/Util/Addresses";
import {
  getVirtualPrice,
  getVirtualPriceViem,
} from "@Pounders/Util/UnionHelper";

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

export async function getUFxsPriceViem(
  llamaService: DefiLlamaService,
  client: PublicClient
) {
  const pxcvx = await getCvxFxsPriceViem(llamaService, client)
    .then((x) => x)
    .catch(() => Infinity);

  const utkn = getContract({
    abi: abiUnionVault,
    address: UnionFxsVaultAddress,
    client,
  });
  const vp = await getVirtualPriceViem(utkn);
  const ucvx = pxcvx * vp;

  return ucvx;
}
