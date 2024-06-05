import { maxApprove } from "@/Wallet";
import { type ERC20, type UnionVault } from "@/Contracts";
import { type ZapDeposit } from "@Pounders/Models/Zap";

import logoFXS from "@/Assets/Icons/Tokens/fxs.png";

export function uFxsDepositZaps(
  getAddress: () => string | undefined,
  getInput: () => bigint | null,
  getVault: () => UnionVault | undefined,
  getAssetTkn: () => ERC20 | undefined
): ZapDeposit[] {
  const deposit = async () => {
    const address = getAddress();
    const vault = getVault();
    const input = getInput();
    const atkn = getAssetTkn();

    if (!address || !vault || !input || !atkn) {
      throw new Error("Unable to construct deposit zaps");
    }

    await maxApprove(atkn, address, vault.address, input);

    const ps = [address, input] as const;
    const estimate = await vault.estimateGas.deposit(...ps);
    const tx = await vault.deposit(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  // Zaps
  const cvxFXS: ZapDeposit = {
    logo: logoFXS,
    label: "cvxFXS",
    zap: () => deposit(),
    depositSymbol: "cvxFXS",
    depositBalance: async () => {
      const address = getAddress();
      const atkn = getAssetTkn();

      if (!address || !atkn) {
        throw new Error("Unable to construct deposit zap balance");
      }

      return await atkn.balanceOf(address).then((x) => x.toBigInt());
    },
    depositDecimals: async () => {
      const atkn = getAssetTkn();

      if (!atkn) {
        throw new Error("Unable to construct deposit zap decimals");
      }

      return await atkn.decimals().then((x) => BigInt(x));
    },
  };

  const options = [cvxFXS];

  return options;
}
