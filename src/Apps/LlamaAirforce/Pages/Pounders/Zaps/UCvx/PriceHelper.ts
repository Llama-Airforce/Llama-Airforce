import { type PublicClient, getContract } from "viem";
import { abi as abiUnionVaultPirex } from "@/ABI/Union/UnionVaultPirex";
import { getPxCvxPrice } from "@/Util";
import { UnionCvxVaultAddress } from "@/Util/Addresses";
import { type DefiLlamaService } from "@/Services";
import { getVirtualPrice } from "@Pounders/Models/Pounder";

export async function getUCvxPrice(
  llamaService: DefiLlamaService,
  client: PublicClient
) {
  const pxcvx = await getPxCvxPrice(llamaService, client)
    .then((x) => x)
    .catch(() => Infinity);

  const utkn = getContract({
    abi: abiUnionVaultPirex,
    address: UnionCvxVaultAddress,
    client,
  });
  const vp = await getVirtualPrice(utkn);
  const ucvx = pxcvx * vp;

  return ucvx;
}
