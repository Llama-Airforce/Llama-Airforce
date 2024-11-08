import type { Address } from "@/Types/Address";
import { abi as abiZaps } from "@/ABI/Union/ZapsUPrismaClaim";
import { maxApprove } from "@/Wallet";
import type { Airdrop, ZapClaim } from "@Pounders/Models";
import { claim } from "@Pounders/Zaps/Helpers";

import logoAirforce from "@/Assets/Icons/Tokens/airforce.png";
import logoPRISMA from "@/Assets/Icons/Tokens/prisma.svg";

export function uPrismaClaimZaps(
  getConfig: () => Config,
  getAddress: () => Address | undefined,
  getAirdrop: () => Airdrop | undefined
): ZapClaim[] {
  const claimAsCvxPrisma = async () => {
    const config = getConfig();
    const address = getAddress();
    const airdrop = getAirdrop();

    if (!address || !airdrop) {
      throw new Error("Unable to construct extra claim zaps");
    }

    await maxApprove(
      config,
      UnionPrismaVaultAddress,
      address,
      ZapsUPrismaClaimAddress,
      airdrop.amount
    );

    const args = [
      BigInt(airdrop.claim.index),
      address,
      airdrop.amount,
      airdrop.claim.proof,
      address,
    ] as const;

    const hash = await writeContract(config, {
      abi: abiZaps,
      address: ZapsUPrismaClaimAddress,
      functionName: "claimFromDistributorAsUnderlying",
      args,
    });

    return waitForTransactionReceipt(config, { hash });
  };

  // Zaps
  const uprisma: ZapClaim = {
    logo: logoAirforce,
    label: "uPRISMA",
    withdrawSymbol: "uPRISMA",
    withdrawDecimals: () => Promise.resolve(18n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: () => claim(getConfig, getAddress, getAirdrop),
  };

  const cvxPRISMA: ZapClaim = {
    logo: logoPRISMA,
    label: "cvxPRISMA",
    withdrawSymbol: "cvxPRISMA",
    withdrawDecimals: () => Promise.resolve(18n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: () => claimAsCvxPrisma(),
  };

  const options = [uprisma, cvxPRISMA];

  return options;
}
