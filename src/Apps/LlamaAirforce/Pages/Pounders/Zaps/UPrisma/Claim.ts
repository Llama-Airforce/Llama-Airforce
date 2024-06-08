import { type Address, type PublicClient, type WalletClient } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import { abi as abiZaps } from "@/ABI/Union/ZapsUPrismaClaim";
import { maxApproveViem } from "@/Wallet";
import type { Airdrop, ZapClaim, Swap } from "@Pounders/Models";
import { claim } from "@Pounders/Zaps/Helpers";

import {
  UnionPrismaVaultAddress,
  ZapsUPrismaClaimAddress,
} from "@/Util/Addresses";

import logoAirforce from "@/Assets/Icons/Tokens/airforce.png";
import logoPRISMA from "@/Assets/Icons/Tokens/prisma.svg";

// eslint-disable-next-line max-lines-per-function
export function uPrismaClaimZaps(
  getClient: () => PublicClient | undefined,
  getWallet: () => Promise<WalletClient | undefined>,
  getAddress: () => Address | undefined,
  getAirdrop: () => Airdrop | undefined
): (ZapClaim | Swap)[] {
  const claimAsCvxPrisma = async () => {
    const address = getAddress();
    const airdrop = getAirdrop();
    const client = getClient();
    const wallet = await getWallet();

    if (!address || !airdrop || !client || !wallet?.account) {
      throw new Error("Unable to construct extra claim zaps");
    }

    await maxApproveViem(
      client,
      wallet,
      UnionPrismaVaultAddress,
      address,
      ZapsUPrismaClaimAddress,
      airdrop.amount
    );

    const args = [
      airdrop.claim.index,
      address,
      airdrop.amount,
      airdrop.claim.proof,
      address,
    ] as const;

    const hash = await wallet.writeContract({
      chain: wallet.chain!,
      account: wallet.account,
      abi: abiZaps,
      address: ZapsUPrismaClaimAddress,
      functionName: "claimFromDistributorAsUnderlying",
      args,
    });

    return waitForTransactionReceipt(client, { hash });
  };

  // Zaps
  const uprisma: ZapClaim = {
    logo: logoAirforce,
    label: "uPRISMA",
    withdrawSymbol: "uPRISMA",
    withdrawDecimals: () => Promise.resolve(18n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: () => claim(getClient, getWallet, getAddress, getAirdrop),
  };

  const cvxPRISMA: ZapClaim = {
    logo: logoPRISMA,
    label: "cvxPRISMA",
    withdrawSymbol: "cvxPRISMA",
    withdrawDecimals: () => Promise.resolve(18n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: () => claimAsCvxPrisma(),
  };

  const swap: Swap = {
    buy: "ETH",
    sell: "cvxPRISMA",
  };

  const options = [uprisma, cvxPRISMA, swap];

  return options;
}
