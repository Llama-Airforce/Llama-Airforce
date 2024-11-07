import { abi } from "@/ABI/Union/UnionVaultPirex";
import { getPxCvxPrice, getCvxApy } from "@/Util";
import type { DefiLlamaService } from "@/Services";
import type { VaultPirex, Pounder } from "@Pounders/Models";
import type FlyerService from "@/Services/FlyerService";

import logo from "@/Assets/Icons/Tokens/cvx.svg";

export default function createCvxPounder(
  config: Config,
  llamaService: DefiLlamaService,
  flyerService: FlyerService
): Pounder<VaultPirex> {
  const client = getPublicClient(config);
  if (!client) throw Error("Cannot create public viem client");

  const getPriceUnderlying = () => getPxCvxPrice(llamaService, client);
  const getApy = () => getCvxApy(flyerService);

  const contract = getContract({
    abi,
    address: UnionCvxVaultAddress,
    client,
  });

  return {
    id: "ucvx",
    name: "Convex (Pirex)",
    logo,
    symbol: "pxCVX",
    description: "description-ucvx",
    asset: PxCvxAddress,
    contract,
    distributor: DistributorUCvxAddress,
    swapDeposit: {
      buy: "CVX",
      sell: "ETH",
    },
    swapWithdraw: {
      buy: "ETH",
      sell: "CVX",
    },
    getPriceUnderlying,
    getApy,
    lp: null,
  };
}
