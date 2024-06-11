import { type Address, type PublicClient, type WalletClient } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import { abi as abiVault } from "@/ABI/Union/UnionVault";
import { abi as abiZapsMigrate } from "@/ABI/Union/ZapsUPrismaConvexMigration";
import { maxApprove } from "@/Wallet";
import type { ZapDeposit, Swap } from "@Pounders/Models";
import { getBalance, getDecimals } from "@Pounders/Zaps/Helpers";

import {
  CvxPrismaAddress,
  UnionPrismaVaultAddress,
  StkCvxPrismaAddress,
} from "@/Util/Addresses";

import logoPRISMA from "@/Assets/Icons/Tokens/prisma.svg";

// eslint-disable-next-line max-lines-per-function
export function uPrismaDepositZaps(
  getClient: () => PublicClient | undefined,
  getWallet: () => Promise<WalletClient | undefined>,
  getAddress: () => Address | undefined,
  getInput: () => bigint | undefined
): (ZapDeposit | Swap)[] {
  const deposit = async () => {
    const client = getClient();
    const wallet = await getWallet();
    const address = getAddress();
    const input = getInput();

    if (!address || !input || !client || !wallet?.account) {
      throw new Error("Unable to construct deposit zaps");
    }

    await maxApprove(
      client,
      wallet,
      CvxPrismaAddress,
      address,
      UnionPrismaVaultAddress,
      input
    );

    const args = [address, input] as const;
    const hash = await wallet.writeContract({
      chain: wallet.chain!,
      account: wallet.account,
      abi: abiVault,
      address: UnionPrismaVaultAddress,
      functionName: "deposit",
      args,
    });

    return waitForTransactionReceipt(client, { hash });
  };

  const depositFromStkCvxPrisma = async () => {
    const client = getClient();
    const wallet = await getWallet();
    const address = getAddress();
    const input = getInput();

    if (!address || !input || !client || !wallet?.account) {
      throw new Error("Unable to construct deposit zaps");
    }

    await maxApprove(
      client,
      wallet,
      StkCvxPrismaAddress,
      address,
      ZapsUPrismaConvexMigrationAddress,
      input
    );

    const args = [input, address] as const;
    const hash = await wallet.writeContract({
      chain: wallet.chain!,
      account: wallet.account,
      abi: abiZapsMigrate,
      address: ZapsUPrismaConvexMigrationAddress,
      functionName: "migrate",
      args,
    });

    return waitForTransactionReceipt(client, { hash });
  };

  // Zaps
  const stkCvxPrisma: ZapDeposit = {
    logo: logoPRISMA,
    label: "Migrate from Convex",
    zap: () => depositFromStkCvxPrisma(),
    depositSymbol: "stkCvxPRISMA",
    depositBalance: () =>
      getBalance(getClient, getAddress, StkCvxPrismaAddress),
    depositDecimals: () => getDecimals(getClient, StkCvxPrismaAddress),
  };

  const cvxPRISMA: ZapDeposit = {
    logo: logoPRISMA,
    label: "cvxPRISMA",
    zap: () => deposit(),
    depositSymbol: "cvxPRISMA",
    depositBalance: () => getBalance(getClient, getAddress, CvxPrismaAddress),
    depositDecimals: () => getDecimals(getClient, CvxPrismaAddress),
  };

  const swap: Swap = {
    buy: "cvxPRISMA",
    sell: "ETH",
  };

  const options = [cvxPRISMA, stkCvxPrisma, swap];

  return options;
}
