import { abi } from "@/ABI/Union/UnionVaultPirex";
import logo from "@/Assets/Icons/Tokens/cvx.svg";
import type { PriceService } from "@/Services";
import type FlyerService from "@/Services/FlyerService";
import { getCvxApy } from "@/Utils/Apy";
import { getPxCvxPrice } from "@/Utils/Price";
import type { VaultPirex, Pounder } from "@Pounders/Models";

export default function createCvxPounder(
  config: Config,
  priceService: PriceService,
  flyerService: FlyerService
): Pounder<VaultPirex> {
  const client = getPublicClient(config);
  if (!client) throw Error("Cannot create public viem client");

  const getPriceUnderlying = () => getPxCvxPrice(priceService, client);
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
