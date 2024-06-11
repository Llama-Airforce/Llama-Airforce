import { type Address, type PublicClient, type WalletClient } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import { abi as abiVault } from "@/ABI/Union/UnionVault";
import { maxApprove } from "@/Wallet";
import type { ZapDeposit, Swap } from "@Pounders/Models";
import { getBalance, getDecimals } from "@Pounders/Zaps/Helpers";

import { CvxCrvAddress, UnionCrvVaultAddress } from "@/Util/Addresses";

import logoCRV from "@/Assets/Icons/Tokens/crv.svg";

// eslint-disable-next-line max-lines-per-function
export function uCrvDepositZaps(
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
      CvxCrvAddress,
      address,
      UnionCrvVaultAddress,
      input
    );

    const args = [address, input] as const;
    const hash = await wallet.writeContract({
      chain: wallet.chain!,
      account: wallet.account,
      abi: abiVault,
      address: UnionCrvVaultAddress,
      functionName: "deposit",
      args,
    });

    return waitForTransactionReceipt(client, { hash });
  };

  // Zaps
  const cvxCRV: ZapDeposit = {
    logo: logoCRV,
    label: "cvxCRV",
    zap: () => deposit(),
    depositSymbol: "cvxCRV",
    depositBalance: () => getBalance(getClient, getAddress, CvxCrvAddress),
    depositDecimals: () => getDecimals(getClient, CvxCrvAddress),
  };

  const swap: Swap = {
    buy: "cvxCRV",
    sell: "ETH",
  };

  const options = [cvxCRV, swap];

  return options;
}
