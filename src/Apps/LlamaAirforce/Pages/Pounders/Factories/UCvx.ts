import { type PublicClient } from "viem";
import { type JsonRpcSigner } from "@ethersproject/providers";
import {
  ERC20__factory,
  MerkleDistributor2__factory,
  type UnionVaultPirex,
  UnionVaultPirex__factory,
} from "@/Contracts";
import { getPxCvxPriceViem, getCvxApy } from "@/Util";
import {
  DistributorUCvxAddress,
  PxCvxAddress,
  UnionCvxVaultAddress,
} from "@/Util/Addresses";
import { type DefiLlamaService } from "@/Services";
import { type Pounder } from "@Pounders/Models";
import type FlyerService from "@/Services/FlyerService";

import logo from "@/Assets/Icons/Tokens/cvx.svg";

export default function createCvxPounder(
  signer: JsonRpcSigner,
  client: PublicClient,
  llamaService: DefiLlamaService,
  flyerService: FlyerService
): Pounder<UnionVaultPirex> {
  const utkn = UnionVaultPirex__factory.connect(UnionCvxVaultAddress, signer);
  const atkn = ERC20__factory.connect(PxCvxAddress, signer);
  const distributor = MerkleDistributor2__factory.connect(
    DistributorUCvxAddress,
    signer
  );

  const getPriceUnderlying = () => getPxCvxPriceViem(llamaService, client);
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
