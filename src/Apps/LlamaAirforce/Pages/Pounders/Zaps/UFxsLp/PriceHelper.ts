import { type PublicClient, getContract } from "viem";
import { abi as abiUnionVault } from "@/ABI/Union/UnionVault";
import { UnionFxsVaultAddressV1 } from "@/Util/Addresses";
import { type DefiLlamaService } from "@/Services";
import { getVirtualPrice } from "@Pounders/Models";

export async function getUFxsPriceV1(
  llamaService: DefiLlamaService,
  client: PublicClient
) {
  const cvxfxslp = await getCvxFxsLpPrice(llamaService, client)
    .then((x) => x)
    .catch(() => Infinity);

  const utkn = getContract({
    abi: abiUnionVault,
    address: UnionFxsVaultAddressV1,
    client,
  });
  const vp = await getVirtualPrice(utkn);
  const ufxs = cvxfxslp * vp;

  return ufxs;
}
