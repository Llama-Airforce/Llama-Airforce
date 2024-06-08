import { type PublicClient, getContract } from "viem";
import { type JsonRpcSigner } from "@ethersproject/providers";
import {
  ERC20__factory,
  type UnionVault,
  UnionVault__factory,
} from "@/Contracts";
import { abi } from "@/ABI/Union/UnionVault";
import { getAuraBalPrice, getAuraBalApy } from "@/Util";
import { AuraBalAddress, UnionBalVaultAddress } from "@/Util/Addresses";
import type FlyerService from "@/Services/FlyerService";
import { type VaultUnion, type Pounder } from "@Pounders/Models";

import logo from "@/Assets/Icons/Tokens/aurabal.png";

export default function createBalPounder(
  signer: JsonRpcSigner,
  client: PublicClient,
  flyerService: FlyerService
): Pounder<UnionVault, VaultUnion> {
  const utkn = UnionVault__factory.connect(UnionBalVaultAddress, signer);
  const atkn = ERC20__factory.connect(AuraBalAddress, signer);

  const getPriceUnderlying = () => getAuraBalPrice(flyerService);
  const getApy = () => getAuraBalApy(flyerService);

  const contract = getContract({
    abi,
    address: UnionBalVaultAddress,
    client,
  });

  return {
    id: "ubal",
    name: "Balancer",
    logo,
    symbol: "auraBAL",
    description: "description-ubal",
    utkn,
    uTknAddress: UnionBalVaultAddress,
    atkn,
    aTknAddress: AuraBalAddress,
    contract,
    getPriceUnderlying,
    getApy,
    lp: null,
  };
}
