import { type Address } from "viem";
import {
  type Config,
  writeContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { abi as abiVault } from "@/ABI/Union/UnionVault";
import type { ZapWithdraw } from "@Pounders/Models";

import { UnionBalVaultAddress } from "@/Util/Addresses";

import logoAuraBAL from "@/Assets/Icons/Tokens/aurabal.png";

export function uBalWithdrawZaps(
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
      address: UnionBalVaultAddress,
      functionName: "withdraw",
      args,
    });

    return waitForTransactionReceipt(config, { hash });
  };

  // Zaps
  const auraBAL: ZapWithdraw = {
    logo: logoAuraBAL,
    label: "auraBAL",
    withdrawSymbol: "auraBAL",
    withdrawDecimals: () => Promise.resolve(18n),
    zap: () => withdraw(),
  };

  const options = [auraBAL];

  return options;
}
