import { type PublicClient, getContract } from "viem";
import { type JsonRpcSigner } from "@ethersproject/providers";
import { abi as abiUnionVaultPirex } from "@/ABI/Union/UnionVaultPirex";
import {
  CurveV2FactoryPool__factory,
  UnionVaultPirex__factory,
} from "@/Contracts";
import { getPxCvxPrice, getPxCvxPriceViem } from "@/Util";
import { PxCvxFactoryAddress, UnionCvxVaultAddress } from "@/Util/Addresses";
import { type DefiLlamaService } from "@/Services";
import {
  getVirtualPrice,
  getVirtualPriceViem,
} from "@Pounders/Util/UnionHelper";

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

export async function getUCvxPriceViem(
  llamaService: DefiLlamaService,
  client: PublicClient
) {
  const pxcvx = await getPxCvxPriceViem(llamaService, client)
    .then((x) => x)
    .catch(() => Infinity);

  const utkn = getContract({
    abi: abiUnionVaultPirex,
    address: UnionCvxVaultAddress,
    client,
  });
  const vp = await getVirtualPriceViem(utkn);
  const ucvx = pxcvx * vp;

  return ucvx;
}
