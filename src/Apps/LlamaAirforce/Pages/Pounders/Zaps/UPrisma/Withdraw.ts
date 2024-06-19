import { type Address } from "viem";
import {
  type Config,
  writeContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { abi as abiVault } from "@/ABI/Union/UnionVault";
import type { ZapWithdraw } from "@Pounders/Models";

import { UnionPrismaVaultAddress } from "@/Util/Addresses";

import logoPRISMA from "@/Assets/Icons/Tokens/prisma.svg";

export function uPrismaWithdrawZaps(
  getConfig: () => Config,
  getAddress: () => Address | undefined,
  getInput: () => bigint | undefined
): ZapWithdraw[] {
  const withdraw = async () => {
    const config = getConfig();
    const address = getAddress();
    const input = getInput();

    if (!address || !input) {
      throw new Error("Unable to construct withdraw zaps");
    }

    const args = [address, input] as const;
    const hash = await writeContract(config, {
      abi: abiVault,
      address: UnionPrismaVaultAddress,
      functionName: "withdraw",
      args,
    });

    return waitForTransactionReceipt(config, { hash });
  };

  // Zaps
  const cvxPRISMA: ZapWithdraw = {
    logo: logoPRISMA,
    label: "cvxPRISMA",
    withdrawSymbol: "cvxPRISMA",
    withdrawDecimals: () => Promise.resolve(18n),
    zap: () => withdraw(),
  };

  const options = [cvxPRISMA];

  return options;
}
