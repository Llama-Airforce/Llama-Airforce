import type { Address } from "@/Types/Address";
import {
  DistributorUCrvAddress,
  DistributorUCvxAddress,
  DistributorUFxsAddress,
  DistributorUPrismaAddress,
  DistributorSCrvUsdAddress,
  UnionCrvVaultAddress,
  UnionCvxVaultAddress,
  UnionFxsVaultAddress,
  UnionPrismaVaultAddress,
  SCrvUsdAddress,
} from "@/Utils/Addresses";
import type { AirdropId } from "@LAF/Services/UnionService";

export type Distributor = {
  address: Address;
  tokenAddress: Address;
  network: "ethereum" | "base";
};

const distUCrv: Distributor = {
  address: DistributorUCrvAddress,
  tokenAddress: UnionCrvVaultAddress,
  network: "ethereum",
};

const distUFxs: Distributor = {
  address: DistributorUFxsAddress,
  tokenAddress: UnionFxsVaultAddress,
  network: "ethereum",
};

const distUPrisma: Distributor = {
  address: DistributorUPrismaAddress,
  tokenAddress: UnionPrismaVaultAddress,
  network: "ethereum",
};

const distUCvx: Distributor = {
  address: DistributorUCvxAddress,
  tokenAddress: UnionCvxVaultAddress,
  network: "ethereum",
};

const distSCrvUsd: Distributor = {
  address: DistributorSCrvUsdAddress,
  tokenAddress: SCrvUsdAddress,
  network: "ethereum",
};

export function getDistributor(airdropId: AirdropId): Distributor {
  switch (airdropId) {
    case "union":
      return distUCrv;
    case "ufxs":
      return distUFxs;
    case "uprisma":
      return distUPrisma;
    case "ucvx":
      return distUCvx;
    case "scrvusd":
      return distSCrvUsd;
    case "cvxprisma":
    default:
      throw new Error(`Unknown airdrop id`);
  }
}
