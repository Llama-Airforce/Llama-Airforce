import { type Address } from "@/Framework/Address";
import {
  DistributorUCrvAddress,
  DistributorUCvxAddress,
  DistributorUFxsAddress,
  DistributorUPrismaAddress,
  UnionCrvVaultAddress,
  UnionCvxVaultAddress,
  UnionFxsVaultAddress,
  UnionPrismaVaultAddress,
} from "@/Util/Addresses";
import { type AirdropId } from "@LAF/Services/UnionService";

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
    case "cvxprisma":
    default:
      throw new Error(`Unknown airdrop id`);
  }
}
