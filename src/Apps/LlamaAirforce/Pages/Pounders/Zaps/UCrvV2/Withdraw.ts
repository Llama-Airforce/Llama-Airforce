import { type Address, type PublicClient, type WalletClient } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import { abi as abiVault } from "@/ABI/Union/UnionVault";
import type { ZapWithdraw, Swap } from "@Pounders/Models";

import { UnionCrvVaultAddressV2 } from "@/Util/Addresses";

import logoCRV from "@/Assets/Icons/Tokens/crv.svg";

export function uCrvV2WithdrawZaps(
  getClient: () => PublicClient | undefined,
  getWallet: () => Promise<WalletClient | undefined>,
  getAddress: () => Address | undefined,
  getInput: () => bigint | null
): (ZapWithdraw | Swap)[] {
  const withdraw = async () => {
    const client = getClient();
    const wallet = await getWallet();
    const address = getAddress();
    const input = getInput();

    if (!address || !input || !client || !wallet?.account) {
      throw new Error("Unable to construct withdraw zaps");
    }

    const args = [address, input] as const;
    const hash = await wallet.writeContract({
      chain: wallet.chain!,
      account: wallet.account,
      abi: abiVault,
      address: UnionCrvVaultAddressV2,
      functionName: "withdraw",
      args,
    });

    return waitForTransactionReceipt(client, { hash });
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
