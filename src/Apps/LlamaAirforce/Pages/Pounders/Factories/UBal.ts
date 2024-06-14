import { getContract } from "viem";
import { type Config } from "@wagmi/core";
import { abi } from "@/ABI/Union/UnionVault";
import { getAuraBalPrice, getAuraBalApy } from "@/Util";
import { UnionBalVaultAddress } from "@/Util/Addresses";
import type FlyerService from "@/Services/FlyerService";
import { type VaultUnion, type Pounder } from "@Pounders/Models";

import logo from "@/Assets/Icons/Tokens/aurabal.png";

export default function createBalPounder(
  config: Config,
  flyerService: FlyerService
): Pounder<VaultUnion> {
  const getPriceUnderlying = () => getAuraBalPrice(flyerService);
  const getApy = () => getAuraBalApy(flyerService);

  const contract = getContract({
    abi,
    address: UnionBalVaultAddress,
    client: config.getClient(),
  });

  return {
    id: "ubal",
    name: "Balancer",
    logo,
    symbol: "auraBAL",
    description: "description-ubal",
    asset: AuraBalAddress,
    contract,
    getPriceUnderlying,
    getApy,
    lp: null,
  };
}
