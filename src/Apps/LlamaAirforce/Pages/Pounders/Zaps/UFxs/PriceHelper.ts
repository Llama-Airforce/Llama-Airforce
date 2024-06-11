import { type PublicClient, getContract } from "viem";
import { abi as abiUnionVault } from "@/ABI/Union/UnionVault";
import { getCvxFxsPrice } from "@/Util";
import { type DefiLlamaService } from "@/Services";
import { UnionFxsVaultAddress } from "@/Util/Addresses";
import { getVirtualPrice } from "@Pounders/Models";

export async function getUFxsPrice(
  llamaService: DefiLlamaService,
  client: PublicClient
) {
  const cvxfxs = await getCvxFxsPrice(llamaService, client)
    .then((x) => x)
    .catch(() => Infinity);

  const utkn = getContract({
    abi: abiUnionVault,
    address: UnionFxsVaultAddress,
    client,
  });
  const vp = await getVirtualPrice(utkn);
  const ufxs = cvxfxs * vp;

  return ufxs;
}
