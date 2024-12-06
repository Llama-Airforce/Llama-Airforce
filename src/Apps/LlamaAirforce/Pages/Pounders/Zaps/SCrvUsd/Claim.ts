import type { Address } from "@/Types/Address";
import type { Airdrop, ZapClaim } from "@Pounders/Models";
import { claim } from "@Pounders/Zaps/Helpers";

import logoSCrvUsd from "@/Assets/Icons/Tokens/scrvusd.webp";

export function sCrvUsdClaimZaps(
  getConfig: () => Config,
  getAddress: () => Address | undefined,
  getAirdrop: () => Airdrop | undefined
): ZapClaim[] {
  const scrvusd: ZapClaim = {
    logo: logoSCrvUsd,
    label: "scrvUSD",
    withdrawSymbol: "scrvUSD",
    withdrawDecimals: () => Promise.resolve(18n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: () => claim(getConfig, getAddress, getAirdrop),
  };

  const options = [scrvusd];

  return options;
}
