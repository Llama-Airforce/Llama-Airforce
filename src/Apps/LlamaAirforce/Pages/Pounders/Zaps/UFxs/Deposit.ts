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

import { CvxFxsAddress, UnionFxsVaultAddress } from "@/Util/Addresses";

import logoFXS from "@/Assets/Icons/Tokens/fxs.png";

export function uFxsDepositZaps(
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
      CvxFxsAddress,
      address,
      UnionFxsVaultAddress,
      input
    );

    const args = [address, input] as const;
    const hash = await writeContract(config, {
      abi: abiVault,
      address: UnionFxsVaultAddress,
      functionName: "deposit",
      args,
    });

    return waitForTransactionReceipt(config, { hash });
  };

  // Zaps
  const cvxFXS: ZapDeposit = {
    logo: logoFXS,
    label: "cvxFXS",
    zap: () => deposit(),
    depositSymbol: "cvxFXS",
    depositBalance: () => getBalance(getConfig, getAddress, CvxFxsAddress),
    depositDecimals: () => getDecimals(getConfig, CvxFxsAddress),
  };

  const swap: Swap = {
    buy: "cvxFXS",
    sell: "ETH",
  };

  const options = [cvxFXS, swap];

  return options;
}
