import { abi as abiUnionVault } from "@/ABI/Union/UnionVault";
import type { DefiLlamaService } from "@/Services";
import { getVirtualPrice } from "@Pounders/Models";

export async function getUFxsPriceV1(
  llamaService: DefiLlamaService,
  config: Config
) {
  const client = getPublicClient(config);
  if (!client) throw Error("Cannot create public viem client");

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
