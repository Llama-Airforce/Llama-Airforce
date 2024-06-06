import { type JsonRpcSigner } from "@ethersproject/providers";
import {
  CurveV6FactoryPool__factory,
  ERC20__factory,
  MerkleDistributor2__factory,
  type UnionVault,
  UnionVault__factory,
} from "@/Contracts";
import { getCvxPrismaPrice, getCvxPrismaApy } from "@/Util";
import {
  CvxPrismaAddress,
  CvxPrismaFactoryAddress,
  DistributorUPrismaAddress,
  UnionPrismaVaultAddress,
} from "@/Util/Addresses";
import { type DefiLlamaService } from "@/Services";
import { type Pounder } from "@Pounders/Models";

import logo from "@/Assets/Icons/Tokens/prisma.svg";

export default function createPrismaPounder(
  signer: JsonRpcSigner,
  llamaService: DefiLlamaService
): Pounder<UnionVault> {
  const utkn = UnionVault__factory.connect(UnionPrismaVaultAddress, signer);
  const atkn = ERC20__factory.connect(CvxPrismaAddress, signer);
  const factory = CurveV6FactoryPool__factory.connect(
    CvxPrismaFactoryAddress,
    signer
  );
  const distributor = MerkleDistributor2__factory.connect(
    DistributorUPrismaAddress,
    signer
  );

  const getPriceUnderlying = () => getCvxPrismaPrice(llamaService, factory);
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
