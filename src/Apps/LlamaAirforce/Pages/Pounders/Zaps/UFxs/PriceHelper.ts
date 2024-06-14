import { getContract } from "viem";
import { type Config } from "@wagmi/core";
import { abi as abiUnionVault } from "@/ABI/Union/UnionVault";
import { getCvxFxsPrice } from "@/Util";
import { type DefiLlamaService } from "@/Services";
import { UnionFxsVaultAddress } from "@/Util/Addresses";
import { getVirtualPrice } from "@Pounders/Models";

export async function getUFxsPrice(
  llamaService: DefiLlamaService,
  config: Config
) {
  const cvxfxs = await getCvxFxsPrice(llamaService, config)
    .then((x) => x)
    .catch(() => Infinity);

  const utkn = getContract({
    abi: abiUnionVault,
    address: UnionFxsVaultAddress,
    client: config.getClient(),
  });
  const vp = await getVirtualPrice(utkn);
  const ufxs = cvxfxs * vp;

  return ufxs;
}
