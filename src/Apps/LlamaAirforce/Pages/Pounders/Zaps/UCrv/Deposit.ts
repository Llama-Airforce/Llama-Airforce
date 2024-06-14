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

import { CvxCrvAddress, UnionCrvVaultAddress } from "@/Util/Addresses";

import logoCRV from "@/Assets/Icons/Tokens/crv.svg";

// eslint-disable-next-line max-lines-per-function
export function uCrvDepositZaps(
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
      CvxCrvAddress,
      address,
      UnionCrvVaultAddress,
      input
    );

    const args = [address, input] as const;
    const hash = await writeContract(config, {
      abi: abiVault,
      address: UnionCrvVaultAddress,
      functionName: "deposit",
      args,
    });

    return waitForTransactionReceipt(config, { hash });
  };

  // Zaps
  const cvxCRV: ZapDeposit = {
    logo: logoCRV,
    label: "cvxCRV",
    zap: () => deposit(),
    depositSymbol: "cvxCRV",
    depositBalance: () => getBalance(getConfig, getAddress, CvxCrvAddress),
    depositDecimals: () => getDecimals(getConfig, CvxCrvAddress),
  };

  const swap: Swap = {
    buy: "cvxCRV",
    sell: "ETH",
  };

  const options = [cvxCRV, swap];

  return options;
}
