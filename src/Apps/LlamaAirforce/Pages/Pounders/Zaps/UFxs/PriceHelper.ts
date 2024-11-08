import { abi as abiUnionVault } from "@/ABI/Union/UnionVault";
import { getCvxFxsPrice } from "@/Utils";
import type { DefiLlamaService } from "@/Services";
import { getVirtualPrice } from "@Pounders/Models";

export async function getUFxsPrice(
  llamaService: DefiLlamaService,
  config: Config
) {
  const client = getPublicClient(config);
  if (!client) throw Error("Cannot create public viem client");

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
