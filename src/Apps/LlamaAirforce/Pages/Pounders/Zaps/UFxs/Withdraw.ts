import type { Address } from "@/Types/Address";
import { abi as abiVault } from "@/ABI/Union/UnionVault";
import type { ZapWithdraw } from "@Pounders/Models";

import logoFXS from "@/Assets/Icons/Tokens/fxs.png";

export function uFxsWithdrawZaps(
  getConfig: () => Config,
  getAddress: () => Address | undefined,
  getInput: () => bigint | undefined
): ZapWithdraw[] {
  const config = getConfig();
  const withdraw = async () => {
    const address = getAddress();
    const input = getInput();

    if (!address || !input) {
      throw new Error("Unable to construct withdraw zaps");
    }

    const args = [address, input] as const;
    const hash = await writeContract(config, {
      abi: abiVault,
      address: UnionFxsVaultAddress,
      functionName: "withdraw",
      args,
    });

    return waitForTransactionReceipt(config, { hash });
  };

  // Zaps
  const cvxFXS: ZapWithdraw = {
    logo: logoFXS,
    label: "cvxFXS",
    withdrawSymbol: "cvxFXS",
    withdrawDecimals: () => Promise.resolve(18n),
    zap: () => withdraw(),
  };

  const options = [cvxFXS];

  return options;
}
