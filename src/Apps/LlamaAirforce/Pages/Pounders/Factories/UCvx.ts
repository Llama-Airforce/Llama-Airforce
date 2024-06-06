import { type JsonRpcSigner } from "@ethersproject/providers";
import {
  CurveV2FactoryPool__factory,
  ERC20__factory,
  MerkleDistributor2__factory,
  type UnionVaultPirex,
  UnionVaultPirex__factory,
} from "@/Contracts";
import { getPxCvxPrice, getCvxApy } from "@/Util";
import {
  DistributorUCvxAddress,
  PxCvxAddress,
  PxCvxFactoryAddress,
  UnionCvxVaultAddress,
} from "@/Util/Addresses";
import { type DefiLlamaService } from "@/Services";
import { type Pounder } from "@Pounders/Models";
import type FlyerService from "@/Services/FlyerService";

import logo from "@/Assets/Icons/Tokens/cvx.svg";

export default function createCvxPounder(
  signer: JsonRpcSigner,
  llamaService: DefiLlamaService,
  flyerService: FlyerService
): Pounder<UnionVaultPirex> {
  const utkn = UnionVaultPirex__factory.connect(UnionCvxVaultAddress, signer);
  const atkn = ERC20__factory.connect(PxCvxAddress, signer);
  const factory = CurveV2FactoryPool__factory.connect(
    PxCvxFactoryAddress,
    signer
  );
  const distributor = MerkleDistributor2__factory.connect(
    DistributorUCvxAddress,
    signer
  );

  const getPriceUnderlying = () => getPxCvxPrice(llamaService, factory);
  const getApy = () => getCvxApy(flyerService);

  return {
    id: "ucvx",
    name: "Convex (Pirex)",
    logo,
    symbol: "pCVX",
    description: "description-ucvx",
    utkn,
    atkn,
    distributor: () => distributor,
    getPriceUnderlying,
    getApy,
    lp: null,
  };
}
