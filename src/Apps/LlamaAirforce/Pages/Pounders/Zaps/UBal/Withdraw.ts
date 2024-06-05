import { type UnionVault } from "@/Contracts";
import { type ZapWithdraw } from "@Pounders/Models/Zap";

import logoAuraBAL from "@/Assets/Icons/Tokens/aurabal.png";

export function uBalWithdrawZaps(
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
