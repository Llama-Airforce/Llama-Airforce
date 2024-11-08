import { abi } from "@/ABI/Union/UnionVault";
import { getCvxCrvApyV2 } from "@/Utils/Apy";
import { getCvxCrvPriceV2 } from "@/Utils/Price";
import type { DefiLlamaService } from "@/Services";
import type { VaultUnion, Pounder } from "@Pounders/Models";

import logo from "@/Assets/Icons/Tokens/crv.svg";

export default function createCrvV2Pounder(
  config: Config,
  llamaService: DefiLlamaService
): Pounder<VaultUnion> {
  const client = getPublicClient(config);
  if (!client) throw Error("Cannot create public viem client");

  const getPriceUnderlying = () => getCvxCrvPriceV2(llamaService, client);
  const getApy = () => getCvxCrvApyV2(client, llamaService);

  const contract = getContract({
    abi,
    address: UnionCrvVaultAddressV2,
    client,
  });

  return {
    id: "ucrv2",
    name: "Curve V2",
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
    distributor: DistributorUCrvAddressV2,
    getPriceUnderlying,
    getApy,
    lp: null,
  };
}
