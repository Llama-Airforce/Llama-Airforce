import { getCvxCrvApy } from "@/Utils/Apy";
import { getCvxCrvPrice } from "@/Utils/Price";
import { abi } from "@/ABI/Union/UnionVault";
import type { PriceService } from "@/Services";
import type { VaultUnion, Pounder } from "@Pounders/Models";

import logo from "@/Assets/Icons/Tokens/crv.svg";

export default function createCrvPounder(
  config: Config,
  priceService: PriceService
): Pounder<VaultUnion> {
  const client = getPublicClient(config);
  if (!client) throw Error("Cannot create public viem client");

  const getPriceUnderlying = () => getCvxCrvPrice(priceService, client);
  const getApy = () => getCvxCrvApy(client, priceService);

  const contract = getContract({
    abi,
    address: UnionCrvVaultAddress,
    client,
  });

  return {
    id: "ucrv",
    name: "Curve",
    logo,
    symbol: "cvxCRV",
    description: "description-ucrv",
    asset: CvxCrvAddress,
    contract,
    swapDeposit: {
      buy: "cvxCRV",
      sell: "ETH",
    },
    swapWithdraw: {
      buy: "ETH",
      sell: "cvxCRV",
    },
    distributor: DistributorUCrvAddress,
    getPriceUnderlying,
    getApy,
    lp: null,
  };
}
