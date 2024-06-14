import { getContract } from "viem";
import { type Config } from "@wagmi/core";
import { abi as abiUnionVaultPirex } from "@/ABI/Union/UnionVaultPirex";
import { getPxCvxPrice } from "@/Util";
import { UnionCvxVaultAddress } from "@/Util/Addresses";
import { type DefiLlamaService } from "@/Services";
import { getVirtualPrice } from "@Pounders/Models/Pounder";

export async function getUCvxPrice(
  llamaService: DefiLlamaService,
  config: Config
) {
  const pxcvx = await getPxCvxPrice(llamaService, config)
    .then((x) => x)
    .catch(() => Infinity);

  const utkn = getContract({
    abi: abiUnionVaultPirex,
    address: UnionCvxVaultAddress,
    client: config.getClient(),
  });
  const vp = await getVirtualPrice(utkn);
  const ucvx = pxcvx * vp;

  return ucvx;
}
