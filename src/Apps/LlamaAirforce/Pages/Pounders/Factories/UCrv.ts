import { getContract } from "viem";
import { type Config } from "@wagmi/core";
import { getCvxCrvPrice, getCvxCrvApy } from "@/Util";
import { abi } from "@/ABI/Union/UnionVault";
import {
  CvxCrvAddress,
  DistributorUCrvAddress,
  UnionCrvVaultAddress,
} from "@/Util/Addresses";
import { type DefiLlamaService } from "@/Services";
import { type VaultUnion, type Pounder } from "@Pounders/Models";

import logo from "@/Assets/Icons/Tokens/crv.svg";

export default function createCrvPounder(
  config: Config,
  llamaService: DefiLlamaService
): Pounder<VaultUnion> {
  const getPriceUnderlying = () => getCvxCrvPrice(llamaService, config);
  const getApy = () => getCvxCrvApy(config, llamaService);

  const contract = getContract({
    abi,
    address: UnionCrvVaultAddress,
    client: config.getClient(),
  });

  return {
    id: "ucrv",
    name: "Curve",
    logo,
    symbol: "cvxCRV",
    description: "description-ucrv",
    asset: CvxCrvAddress,
    contract,
    distributor: DistributorUCrvAddress,
    getPriceUnderlying,
    getApy,
    lp: null,
  };
}
