import { type PublicClient } from "viem";
import { type JsonRpcSigner } from "@ethersproject/providers";
import {
  ERC20__factory,
  MerkleDistributor2__factory,
  type UnionVault,
  UnionVault__factory,
} from "@/Contracts";
import { getCvxPrismaPriceViem, getCvxPrismaApy } from "@/Util";
import {
  CvxPrismaAddress,
  DistributorUPrismaAddress,
  UnionPrismaVaultAddress,
} from "@/Util/Addresses";
import { type DefiLlamaService } from "@/Services";
import { type Pounder } from "@Pounders/Models";

import logo from "@/Assets/Icons/Tokens/prisma.svg";

export default function createPrismaPounder(
  signer: JsonRpcSigner,
  client: PublicClient,
  llamaService: DefiLlamaService
): Pounder<UnionVault> {
  const utkn = UnionVault__factory.connect(UnionPrismaVaultAddress, signer);
  const atkn = ERC20__factory.connect(CvxPrismaAddress, signer);
  const distributor = MerkleDistributor2__factory.connect(
    DistributorUPrismaAddress,
    signer
  );

  const getPriceUnderlying = () => getCvxPrismaPriceViem(llamaService, client);
  const getApy = () => getCvxPrismaApy(signer, llamaService);

  return {
    id: "uprisma",
    name: "Prisma",
    logo,
    symbol: "cvxPRISMA",
    description: "description-uprisma",
    utkn,
    atkn,
    distributor: () => distributor,
    getPriceUnderlying,
    getApy,
    lp: null,
  };
}
