import { abi as abiUnionVault } from "@/ABI/Union/UnionVault";
import type { PriceService } from "@/Services";
import { getCvxFxsPrice } from "@/Utils/Price";
import { getVirtualPrice } from "@Pounders/Models";

export async function getUFxsPrice(priceService: PriceService, config: Config) {
  const client = getPublicClient(config);
  if (!client) throw Error("Cannot create public viem client");

  const cvxfxs = await getCvxFxsPrice(priceService, client)
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
