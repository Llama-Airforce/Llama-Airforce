import { abi as abiUnionVaultPirex } from "@/ABI/Union/UnionVaultPirex";
import { getPxCvxPrice } from "@/Util";
import type { DefiLlamaService } from "@/Services";
import { getVirtualPrice } from "@Pounders/Models/Pounder";

export async function getUCvxPrice(
  llamaService: DefiLlamaService,
  config: Config
) {
  const client = getPublicClient(config);
  if (!client) return 0;

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
