import { type UnionVault } from "@/Contracts";
import { type ZapWithdraw } from "@Pounders/Models/Zap";

import logoCRV from "@/Assets/Icons/Tokens/crv.svg";

export function uCrvWithdrawZaps(
  getAddress: () => string | undefined,
  getInput: () => bigint | null,
  getVault: () => UnionVault | undefined
): ZapWithdraw[] {
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

  const options = [cvxCRV];

  return options;
}
