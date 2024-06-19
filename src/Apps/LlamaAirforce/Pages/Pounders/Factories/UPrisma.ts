import { getContract } from "viem";
import { type Config, getPublicClient } from "@wagmi/core";
import { abi } from "@/ABI/Union/UnionVault";
import { getCvxPrismaPrice, getCvxPrismaApy } from "@/Util";
import {
  CvxPrismaAddress,
  DistributorUPrismaAddress,
  UnionPrismaVaultAddress,
} from "@/Util/Addresses";
import { type DefiLlamaService } from "@/Services";
import { type VaultUnion, type Pounder } from "@Pounders/Models";

import logo from "@/Assets/Icons/Tokens/prisma.svg";

export default function createPrismaPounder(
  config: Config,
  llamaService: DefiLlamaService
): Pounder<VaultUnion> {
  const client = getPublicClient(config);
  if (!client) throw Error("Cannot create public viem client");

  const getPriceUnderlying = () => getCvxPrismaPrice(llamaService, client);
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
