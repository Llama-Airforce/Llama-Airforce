import { type PublicClient, getContract } from "viem";
import { abi as abiUnionVault } from "@/ABI/Union/UnionVault";
import { getCvxFxsPriceViem } from "@/Util";
import { type DefiLlamaService } from "@/Services";
import { UnionFxsVaultAddress } from "@/Util/Addresses";
import { getVirtualPriceViem } from "@Pounders/Util/UnionHelper";

export async function getUFxsPrice(
  llamaService: DefiLlamaService,
  client: PublicClient
) {
  const cvxfxs = await getCvxFxsPriceViem(llamaService, client)
    .then((x) => x)
    .catch(() => Infinity);

  const utkn = getContract({
    abi: abiUnionVault,
    address: UnionFxsVaultAddress,
    client,
  });
  const vp = await getVirtualPriceViem(utkn);
  const ufxs = cvxfxs * vp;

  return ufxs;
}
