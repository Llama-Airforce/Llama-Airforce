import { abi } from "@/ABI/Union/UnionVault";
import { getCvxFxsApy } from "@/Utils/Apy";
import { getCvxFxsPrice } from "@/Utils/Price";
import type { DefiLlamaService } from "@/Services";
import type { VaultUnion, Pounder } from "@Pounders/Models";

import logo from "@/Assets/Icons/Tokens/cvxfxs.png";

export default function createFxsPounder(
  config: Config,
  llamaService: DefiLlamaService
): Pounder<VaultUnion> {
  const client = getPublicClient(config);
  if (!client) throw Error("Cannot create public viem client");

  const getPriceUnderlying = () => getCvxFxsPrice(llamaService, client);
  const getApy = () => getCvxFxsApy(client, llamaService);

  const contract = getContract({
    abi,
    address: UnionFxsVaultAddress,
    client,
  });

  return {
    id: "ufxs",
    name: "Frax",
    logo,
    symbol: "cvxFXS",
    description: "description-ufxs",
    asset: CvxFxsAddress,
    contract,
    swapDeposit: {
      buy: "cvxFXS",
      sell: "ETH",
    },
    swapWithdraw: {
      buy: "ETH",
      sell: "cvxFXS",
    },
    distributor: DistributorUFxsAddress,
    getPriceUnderlying,
    getApy,
    lp: null,
  };
}
