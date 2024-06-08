import { type PublicClient, getContract } from "viem";
import { type JsonRpcSigner } from "@ethersproject/providers";
import { abi as abiUnionVault } from "@/ABI/Union/UnionVault";
import { UnionVault__factory } from "@/Contracts";
import { getCvxFxsLpPrice } from "@/Util";
import { UnionFxsVaultAddressV1 } from "@/Util/Addresses";
import { type DefiLlamaService } from "@/Services";
import {
  getVirtualPrice,
  getVirtualPriceViem,
} from "@Pounders/Util/UnionHelper";

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

export async function getUFxsPriceV1Viem(
  llamaService: DefiLlamaService,
  client: PublicClient
) {
  const cvxfxslp = await getCvxFxsLpPriceViem(llamaService, client)
    .then((x) => x)
    .catch(() => Infinity);

  const utkn = getContract({
    abi: abiUnionVault,
    address: UnionFxsVaultAddressV1,
    client,
  });
  const vp = await getVirtualPriceViem(utkn);
  const ufxs = cvxfxslp * vp;

  return ufxs;
}
