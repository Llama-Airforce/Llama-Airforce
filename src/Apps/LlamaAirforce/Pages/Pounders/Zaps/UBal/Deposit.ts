import type { Address } from "@/Types/Address";
import { abi as abiVault } from "@/ABI/Union/UnionVault";
import { maxApprove } from "@/Utils/Wallet";
import type { ZapDeposit } from "@Pounders/Models";
import { getBalance, getDecimals } from "@Pounders/Zaps/Helpers";

import logoAuraBAL from "@/Assets/Icons/Tokens/aurabal.png";

export function uBalDepositZaps(
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
      AuraBalAddress,
      address,
      UnionBalVaultAddress,
      input
    );

    const args = [address, input] as const;
    const hash = await writeContract(config, {
      abi: abiVault,
      address: UnionBalVaultAddress,
      functionName: "deposit",
      args,
    });

    return waitForTransactionReceipt(config, { hash });
  };

  // Zaps
  const auraBAL: ZapDeposit = {
    logo: logoAuraBAL,
    label: "auraBAL",
    zap: () => deposit(),
    depositBalance: () => getBalance(getConfig, getAddress, AuraBalAddress),
    depositDecimals: () => getDecimals(getConfig, AuraBalAddress),
    depositSymbol: "auraBAL",
  };

  const options = [auraBAL];

  return options;
}
