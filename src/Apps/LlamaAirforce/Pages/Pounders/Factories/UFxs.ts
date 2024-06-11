import { type PublicClient, getContract } from "viem";
import { abi } from "@/ABI/Union/UnionVault";
import { getCvxFxsPrice, getCvxFxsApy } from "@/Util";
import {
  CvxFxsAddress,
  DistributorUFxsAddress,
  UnionFxsVaultAddress,
} from "@/Util/Addresses";
import { type DefiLlamaService } from "@/Services";
import { type VaultUnion, type Pounder } from "@Pounders/Models";

import logo from "@/Assets/Icons/Tokens/cvxfxs.png";

export default function createFxsPounder(
  client: PublicClient,
  llamaService: DefiLlamaService
): Pounder<VaultUnion> {
  const getPriceUnderlying = () => getCvxFxsPrice(llamaService, client);
  const getApy = () => getCvxFxsApy(client, llamaService);

  const contract = getContract({
    abi,
    address: UnionFxsVaultAddress,
    client,
  });

  return {
    id: "ufxs",
    name: "Frax",
    logo,
    symbol: "cvxFXS",
    description: "description-ufxs",
    asset: CvxFxsAddress,
    contract,
    distributor: DistributorUFxsAddress,
    getPriceUnderlying,
    getApy,
    lp: null,
  };
}
