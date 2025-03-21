import { abi } from "@/ABI/Union/UnionVault";
import logo from "@/Assets/Icons/Tokens/aurabal.png";
import type FlyerService from "@/Services/FlyerService";
import { getAuraBalApy } from "@/Utils/Apy";
import { getAuraBalPrice } from "@/Utils/Price";
import type { VaultUnion, Pounder } from "@Pounders/Models";

export default function createBalPounder(
  config: Config,
  flyerService: FlyerService
): Pounder<VaultUnion> {
  const client = getPublicClient(config);
  if (!client) throw Error("Cannot create public viem client");

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
    asset: AuraBalAddress,
    contract,
    swapDeposit: {
      buy: "auraBAL",
      sell: "ETH",
    },
    swapWithdraw: {
      buy: "ETH",
      sell: "auraBAL",
    },
    getPriceUnderlying,
    getApy,
    lp: null,
  };
}
