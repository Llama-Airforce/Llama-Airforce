import { type Address, type PublicClient, type WalletClient } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import { abi as abiVault } from "@/ABI/Union/UnionVault";
import { maxApprove } from "@/Wallet";
import type { ZapDeposit, Swap } from "@Pounders/Models";
import { getBalance, getDecimals } from "@Pounders/Zaps/Helpers";

import { AuraBalAddress, UnionBalVaultAddress } from "@/Util/Addresses";

import logoAuraBAL from "@/Assets/Icons/Tokens/aurabal.png";

export function uBalDepositZaps(
  getClient: () => PublicClient | undefined,
  getWallet: () => Promise<WalletClient | undefined>,
  getAddress: () => Address | undefined,
  getInput: () => bigint | undefined
): (ZapDeposit | Swap)[] {
  const deposit = async () => {
    const client = getClient();
    const wallet = await getWallet();
    const address = getAddress();
    const input = getInput();

    if (!address || !input || !client || !wallet?.account) {
      throw new Error("Unable to construct deposit zaps");
    }

    await maxApprove(
      client,
      wallet,
      AuraBalAddress,
      address,
      UnionBalVaultAddress,
      input
    );

    const args = [address, input] as const;
    const hash = await wallet.writeContract({
      chain: wallet.chain!,
      account: wallet.account,
      abi: abiVault,
      address: UnionBalVaultAddress,
      functionName: "deposit",
      args,
    });

    return waitForTransactionReceipt(client, { hash });
  };

  // Zaps
  const auraBAL: ZapDeposit = {
    logo: logoAuraBAL,
    label: "auraBAL",
    zap: () => deposit(),
    depositBalance: () => getBalance(getClient, getAddress, AuraBalAddress),
    depositDecimals: () => getDecimals(getClient, AuraBalAddress),
    depositSymbol: "auraBAL",
  };

  const swap: Swap = {
    buy: "auraBAL",
    sell: "ETH",
  };

  const options = [auraBAL, swap];

  return options;
}
