import logoSReUsd from "@/Assets/Icons/Tokens/sreusd.svg";
import type { Address } from "@/types/address";
import type { Airdrop, ZapClaim } from "@Pounders/Models";
import { claim } from "@Pounders/Zaps/Helpers";

export function sReUsdClaimZaps(
  getConfig: () => Config,
  getAddress: () => Address | undefined,
  getAirdrop: () => Airdrop | undefined
): ZapClaim[] {
  const scrvusd: ZapClaim = {
    logo: logoSReUsd,
    label: "sreUSD",
    withdrawSymbol: "sreUSD",
    withdrawDecimals: () => Promise.resolve(18n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: () => claim(getConfig, getAddress, getAirdrop),
  };

  const options = [scrvusd];

  return options;
}
