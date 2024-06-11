import { getContract, type PublicClient } from "viem";
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
  client: PublicClient,
  llamaService: DefiLlamaService
): Pounder<VaultUnion> {
  const getPriceUnderlying = () => getCvxCrvPrice(llamaService, client);
  const getApy = () => getCvxCrvApy(client, llamaService);

  const contract = getContract({
    abi,
    address: UnionCrvVaultAddress,
    client,
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
