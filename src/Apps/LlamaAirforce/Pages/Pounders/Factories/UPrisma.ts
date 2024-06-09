import { type PublicClient, getContract } from "viem";
import { abi } from "@/ABI/Union/UnionVault";
import { getCvxPrismaPriceViem, getCvxPrismaApy } from "@/Util";
import {
  CvxPrismaAddress,
  DistributorUPrismaAddress,
  UnionPrismaVaultAddress,
} from "@/Util/Addresses";
import { type DefiLlamaService } from "@/Services";
import { type VaultUnion, type Pounder } from "@Pounders/Models";

import logo from "@/Assets/Icons/Tokens/prisma.svg";

export default function createPrismaPounder(
  client: PublicClient,
  llamaService: DefiLlamaService
): Pounder<VaultUnion> {
  const getPriceUnderlying = () => getCvxPrismaPriceViem(llamaService, client);
  const getApy = () => getCvxPrismaApy(client, llamaService);

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
    distributor: DistributorUPrismaAddress,
    getPriceUnderlying,
    getApy,
    lp: null,
  };
}
