import { abi } from "@/ABI/Union/UnionVault";
import logo from "@/Assets/Icons/Tokens/prisma.svg";
import type { PriceService } from "@/Services";
import { getCvxPrismaApy } from "@/Utils/Apy";
import { getCvxPrismaPrice } from "@/Utils/Price";
import type { VaultUnion, Pounder } from "@Pounders/Models";

export default function createPrismaPounder(
  config: Config,
  priceService: PriceService
): Pounder<VaultUnion> {
  const client = getPublicClient(config);
  if (!client) throw Error("Cannot create public viem client");

  const getPriceUnderlying = () => getCvxPrismaPrice(priceService, client);
  const getApy = () => getCvxPrismaApy(client, priceService);

  const contract = getContract({
    abi,
    address: UnionPrismaVaultAddress,
    client,
  });

  return {
    id: "uprisma",
    name: "Prisma",
    logo,
    symbol: "cvxPRISMA",
    description: "description-uprisma",
    asset: CvxPrismaAddress,
    contract,
    swapDeposit: {
      buy: "cvxPRISMA",
      sell: "ETH",
    },
    swapWithdraw: {
      buy: "ETH",
      sell: "cvxPRISMA",
    },
    distributor: DistributorUPrismaAddress,
    getPriceUnderlying,
    getApy,
    lp: null,
  };
}
