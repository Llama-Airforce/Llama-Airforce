import { abi } from "@/ABI/Union/UnionVault";
import logo from "@/Assets/Icons/Tokens/crv.svg";
import type { PriceService } from "@/Services";
import { getCvxCrvApyV2 } from "@/Utils/Apy";
import { getCvxCrvPriceV2 } from "@/Utils/Price";
import type { VaultUnion, Pounder } from "@Pounders/Models";

export default function createCrvV2Pounder(
  config: Config,
  priceService: PriceService
): Pounder<VaultUnion> {
  const client = getPublicClient(config);
  if (!client) throw Error("Cannot create public viem client");

  const getPriceUnderlying = () => getCvxCrvPriceV2(priceService, client);
  const getApy = () => getCvxCrvApyV2(client, priceService);

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
