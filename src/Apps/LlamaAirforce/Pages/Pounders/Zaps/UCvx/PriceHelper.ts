import { type PublicClient, getContract } from "viem";
import { abi as abiUnionVaultPirex } from "@/ABI/Union/UnionVaultPirex";
import { getPxCvxPriceViem } from "@/Util";
import { UnionCvxVaultAddress } from "@/Util/Addresses";
import { type DefiLlamaService } from "@/Services";
import { getVirtualPriceViem } from "@Pounders/Util/UnionHelper";

export async function getUCvxPrice(
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
