import { abi as abiVault } from "@/ABI/Union/UnionVault";
import type { ZapWithdraw } from "@Pounders/Models";

import logoCRV from "@/Assets/Icons/Tokens/crv.svg";

export function uCrvWithdrawZaps(
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
      address: UnionCrvVaultAddress,
      functionName: "withdraw",
      args,
    });

    return waitForTransactionReceipt(config, { hash });
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
