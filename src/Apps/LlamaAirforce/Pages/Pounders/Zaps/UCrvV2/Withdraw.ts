import { type UnionVault } from "@/Contracts";
import type { ZapWithdraw, Swap } from "@Pounders/Models";

import logoCRV from "@/Assets/Icons/Tokens/crv.svg";

export function uCrvV2WithdrawZaps(
  getAddress: () => string | undefined,
  getInput: () => bigint | null,
  getVault: () => UnionVault | undefined
): (ZapWithdraw | Swap)[] {
  const withdraw = async () => {
    const address = getAddress();
    const vault = getVault();
    const input = getInput();

    if (!address || !vault || !input) {
      throw new Error("Unable to construct withdraw zaps");
    }

    const ps = [address, input] as const;
    const estimate = await vault.estimateGas.withdraw(...ps);
    const tx = await vault.withdraw(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  // Zaps
  const cvxCRV: ZapWithdraw = {
    logo: logoCRV,
    label: "cvxCRV",
    withdrawSymbol: "cvxCRV",
    withdrawDecimals: () => Promise.resolve(18n),
    zap: () => withdraw(),
  };

  const swap: Swap = {
    buy: "ETH",
    sell: "cvxCRV",
  };

  const options = [cvxCRV, swap];

  return options;
}
