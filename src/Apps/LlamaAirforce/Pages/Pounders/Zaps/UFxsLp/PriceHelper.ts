import { abi as abiUnionVault } from "@/ABI/Union/UnionVault";
import type { PriceService } from "@/Services";
import { getVirtualPrice } from "@Pounders/Models";

export async function getUFxsPriceV1(
  priceService: PriceService,
  config: Config
) {
  const client = getPublicClient(config);
  if (!client) throw Error("Cannot create public viem client");

  const cvxfxslp = await getCvxFxsLpPrice(priceService, client)
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
