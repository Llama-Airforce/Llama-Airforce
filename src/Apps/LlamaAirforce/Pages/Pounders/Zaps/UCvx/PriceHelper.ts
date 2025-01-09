import { abi as abiUnionVaultPirex } from "@/ABI/Union/UnionVaultPirex";
import { getPxCvxPrice } from "@/Utils/Price";
import type { PriceService } from "@/Services";
import { getVirtualPrice } from "@Pounders/Models/Pounder";

export async function getUCvxPrice(priceService: PriceService, config: Config) {
  const client = getPublicClient(config);
  if (!client) return 0;

  const pxcvx = await getPxCvxPrice(priceService, client)
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
