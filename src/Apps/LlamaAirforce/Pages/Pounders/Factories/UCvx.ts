import { type PublicClient, getContract } from "viem";
import { abi } from "@/ABI/Union/UnionVaultPirex";
import { getPxCvxPriceViem, getCvxApy } from "@/Util";
import {
  DistributorUCvxAddress,
  PxCvxAddress,
  UnionCvxVaultAddress,
} from "@/Util/Addresses";
import { type DefiLlamaService } from "@/Services";
import { type VaultPirex, type Pounder } from "@Pounders/Models";
import type FlyerService from "@/Services/FlyerService";

import logo from "@/Assets/Icons/Tokens/cvx.svg";

export default function createCvxPounder(
  client: PublicClient,
  llamaService: DefiLlamaService,
  flyerService: FlyerService
): Pounder<VaultPirex> {
  const getPriceUnderlying = () => getPxCvxPriceViem(llamaService, client);
  const getApy = () => getCvxApy(flyerService);

  const contract = getContract({
    abi,
    address: UnionCvxVaultAddress,
    client,
  });

  return {
    id: "ucvx",
    name: "Convex (Pirex)",
    logo,
    symbol: "pCVX",
    description: "description-ucvx",
    asset: PxCvxAddress,
    contract,
    distributor: DistributorUCvxAddress,
    getPriceUnderlying,
    getApy,
    lp: null,
  };
}
