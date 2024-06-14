import { getContract } from "viem";
import { type Config } from "@wagmi/core";
import { abi as abiUnionVault } from "@/ABI/Union/UnionVault";
import { UnionFxsVaultAddressV1 } from "@/Util/Addresses";
import { type DefiLlamaService } from "@/Services";
import { getVirtualPrice } from "@Pounders/Models";

export async function getUFxsPriceV1(
  llamaService: DefiLlamaService,
  config: Config
) {
  const cvxfxslp = await getCvxFxsLpPrice(llamaService, config)
    .then((x) => x)
    .catch(() => Infinity);

  const utkn = getContract({
    abi: abiUnionVault,
    address: UnionFxsVaultAddressV1,
    client: config.getClient(),
  });
  const vp = await getVirtualPrice(utkn);
  const ufxs = cvxfxslp * vp;

  return ufxs;
}
