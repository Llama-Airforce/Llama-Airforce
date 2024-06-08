import { type PublicClient, getContract } from "viem";
import { type JsonRpcSigner } from "@ethersproject/providers";
import {
  ERC20__factory,
  type UnionVault,
  UnionVault__factory,
} from "@/Contracts";
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
  signer: JsonRpcSigner,
  client: PublicClient,
  llamaService: DefiLlamaService
): Pounder<UnionVault, VaultUnion> {
  const utkn = UnionVault__factory.connect(UnionPrismaVaultAddress, signer);
  const atkn = ERC20__factory.connect(CvxPrismaAddress, signer);

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
    utkn,
    uTknAddress: UnionPrismaVaultAddress,
    atkn,
    aTknAddress: CvxPrismaAddress,
    contract,
    distributor: DistributorUPrismaAddress,
    getPriceUnderlying,
    getApy,
    lp: null,
  };
}
