import type { Address } from "@/types/address";
import { abi as abiVault } from "@/ABI/Union/UnionVault";
import { abi as abiZapsMigrate } from "@/ABI/Union/ZapsUPrismaConvexMigration";
import { maxApprove } from "@/Utils/Wallet";
import type { ZapDeposit } from "@Pounders/Models";
import { getBalance, getDecimals } from "@Pounders/Zaps/Helpers";

import logoPRISMA from "@/Assets/Icons/Tokens/prisma.svg";

export function uPrismaDepositZaps(
  getConfig: () => Config,
  getAddress: () => Address | undefined,
  getInput: () => bigint | undefined
): ZapDeposit[] {
  const deposit = async () => {
    const config = getConfig();
    const address = getAddress();
    const input = getInput();

    if (!address || !input) {
      throw new Error("Unable to construct deposit zaps");
    }

    await maxApprove(
      config,
      CvxPrismaAddress,
      address,
      UnionPrismaVaultAddress,
      input
    );

    const args = [address, input] as const;
    const hash = await writeContract(config, {
      abi: abiVault,
      address: UnionPrismaVaultAddress,
      functionName: "deposit",
      args,
    });

    return waitForTransactionReceipt(config, { hash });
  };

  const depositFromStkCvxPrisma = async () => {
    const config = getConfig();
    const address = getAddress();
    const input = getInput();

    if (!address || !input) {
      throw new Error("Unable to construct deposit zaps");
    }

    await maxApprove(
      config,
      StkCvxPrismaAddress,
      address,
      ZapsUPrismaConvexMigrationAddress,
      input
    );

    const args = [input, address] as const;
    const hash = await writeContract(config, {
      abi: abiZapsMigrate,
      address: ZapsUPrismaConvexMigrationAddress,
      functionName: "migrate",
      args,
    });

    return waitForTransactionReceipt(config, { hash });
  };

  // Zaps
  const stkCvxPrisma: ZapDeposit = {
    logo: logoPRISMA,
    label: "Migrate from Convex",
    zap: () => depositFromStkCvxPrisma(),
    depositSymbol: "stkCvxPRISMA",
    depositBalance: () =>
      getBalance(getConfig, getAddress, StkCvxPrismaAddress),
    depositDecimals: () => getDecimals(getConfig, StkCvxPrismaAddress),
  };

  const cvxPRISMA: ZapDeposit = {
    logo: logoPRISMA,
    label: "cvxPRISMA",
    zap: () => deposit(),
    depositSymbol: "cvxPRISMA",
    depositBalance: () => getBalance(getConfig, getAddress, CvxPrismaAddress),
    depositDecimals: () => getDecimals(getConfig, CvxPrismaAddress),
  };

  const options = [cvxPRISMA, stkCvxPrisma];

  return options;
}
