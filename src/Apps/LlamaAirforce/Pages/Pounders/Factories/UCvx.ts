import { getContract } from "viem";
import { type Config } from "@wagmi/core";
import { abi } from "@/ABI/Union/UnionVaultPirex";
import { getPxCvxPrice, getCvxApy } from "@/Util";
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
  config: Config,
  llamaService: DefiLlamaService,
  flyerService: FlyerService
): Pounder<VaultPirex> {
  const getPriceUnderlying = () => getPxCvxPrice(llamaService, config);
  const getApy = () => getCvxApy(flyerService);

  const contract = getContract({
    abi,
    address: UnionCvxVaultAddress,
    client: config.getClient(),
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
