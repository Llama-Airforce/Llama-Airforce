import { type Address } from "viem";
import {
  type Config,
  writeContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { abi as abiVault } from "@/ABI/Union/UnionVault";
import { maxApprove } from "@/Wallet";
import type { ZapDeposit, Swap } from "@Pounders/Models";
import { getBalance, getDecimals } from "@Pounders/Zaps/Helpers";

import { AuraBalAddress, UnionBalVaultAddress } from "@/Util/Addresses";

import logoAuraBAL from "@/Assets/Icons/Tokens/aurabal.png";

export function uBalDepositZaps(
  getConfig: () => Config,
  getAddress: () => Address | undefined,
  getInput: () => bigint | undefined
): (ZapDeposit | Swap)[] {
  const deposit = async () => {
    const config = getConfig();
    const address = getAddress();
    const input = getInput();

    if (!address || !input) {
      throw new Error("Unable to construct deposit zaps");
    }

    await maxApprove(
      config,
      AuraBalAddress,
      address,
      UnionBalVaultAddress,
      input
    );

    const args = [address, input] as const;
    const hash = await writeContract(config, {
      abi: abiVault,
      address: UnionBalVaultAddress,
      functionName: "deposit",
      args,
    });

    return waitForTransactionReceipt(config, { hash });
  };

  // Zaps
  const auraBAL: ZapDeposit = {
    logo: logoAuraBAL,
    label: "auraBAL",
    zap: () => deposit(),
    depositBalance: () => getBalance(getConfig, getAddress, AuraBalAddress),
    depositDecimals: () => getDecimals(getConfig, AuraBalAddress),
    depositSymbol: "auraBAL",
  };

  const swap: Swap = {
    buy: "auraBAL",
    sell: "ETH",
  };

  const options = [auraBAL, swap];

  return options;
}
