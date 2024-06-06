import { type JsonRpcSigner } from "@ethersproject/providers";
import {
  ERC20__factory,
  type UnionVault,
  UnionVault__factory,
} from "@/Contracts";
import { getAuraBalPrice, getAuraBalApy } from "@/Util";
import { AuraBalAddress, UnionBalVaultAddress } from "@/Util/Addresses";
import type FlyerService from "@/Services/FlyerService";
import { type Pounder } from "@Pounders/Models";

import logo from "@/Assets/Icons/Tokens/aurabal.png";

export default function createBalPounder(
  signer: JsonRpcSigner,
  flyerService: FlyerService
): Pounder<UnionVault> {
  const utkn = UnionVault__factory.connect(UnionBalVaultAddress, signer);
  const atkn = ERC20__factory.connect(AuraBalAddress, signer);

  const getPriceUnderlying = () => getAuraBalPrice(flyerService);
  const getApy = () => getAuraBalApy(flyerService);

  return {
    id: "ubal",
    name: "Balancer",
    logo,
    symbol: "auraBAL",
    description: "description-ubal",
    utkn,
    atkn,
    distributor: () => null,
    getPriceUnderlying,
    getApy,
    lp: null,
  };
}
