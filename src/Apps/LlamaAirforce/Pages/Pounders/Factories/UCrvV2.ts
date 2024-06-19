import { getContract } from "viem";
import { type Config, getPublicClient } from "@wagmi/core";
import { abi } from "@/ABI/Union/UnionVault";
import { getCvxCrvPriceV2, getCvxCrvApyV2 } from "@/Util";
import {
  CvxCrvAddress,
  DistributorUCrvAddressV2,
  UnionCrvVaultAddressV2,
} from "@/Util/Addresses";
import { type DefiLlamaService } from "@/Services";
import { type VaultUnion, type Pounder } from "@Pounders/Models";

import logo from "@/Assets/Icons/Tokens/crv.svg";

export default function createCrvV2Pounder(
  config: Config,
  llamaService: DefiLlamaService
): Pounder<VaultUnion> {
  const client = getPublicClient(config);
  if (!client) throw Error("Cannot create public viem client");

  const getPriceUnderlying = () => getCvxCrvPriceV2(llamaService, client);
  const getApy = () => getCvxCrvApyV2(client, llamaService);

  const contract = getContract({
    abi,
    address: UnionCrvVaultAddressV2,
    client,
  });

  return {
    id: "ucrv2",
    name: "Curve V2",
    logo,
    symbol: "cvxCRV",
    description: "description-ucrv",
    asset: CvxCrvAddress,
    contract,
    distributor: DistributorUCrvAddressV2,
    getPriceUnderlying,
    getApy,
    lp: null,
  };
}
