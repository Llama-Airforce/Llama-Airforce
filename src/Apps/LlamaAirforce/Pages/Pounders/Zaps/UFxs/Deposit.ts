import { abi as abiVault } from "@/ABI/Union/UnionVault";
import logoFXS from "@/Assets/Icons/Tokens/fxs.png";
import type { Address } from "@/types/address";
import { maxApprove } from "@/Utils/Wallet";
import type { ZapDeposit } from "@Pounders/Models";
import { getBalance, getDecimals } from "@Pounders/Zaps/Helpers";

export function uFxsDepositZaps(
  getConfig: () => Config,
  getAddress: () => Address | undefined,
  getInput: () => bigint | undefined
): ZapDeposit[] {
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

  const options = [cvxFXS];

  return options;
}
