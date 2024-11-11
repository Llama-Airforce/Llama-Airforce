import type { Address } from "@/Types/Address";
import { abi as abiVault } from "@/ABI/Union/UnionVault";
import { maxApprove } from "@/Utils/Wallet";
import type { ZapDeposit } from "@Pounders/Models";
import { getBalance, getDecimals } from "@Pounders/Zaps/Helpers";

import logoCRV from "@/Assets/Icons/Tokens/crv.svg";

export function uCrvV2DepositZaps(
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
      CvxCrvAddress,
      address,
      UnionCrvVaultAddressV2,
      input
    );

    const args = [address, input] as const;
    const hash = await writeContract(config, {
      abi: abiVault,
      address: UnionCrvVaultAddressV2,
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

  const options = [cvxCRV];

  return options;
}
