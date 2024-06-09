import { type Address, type PublicClient, type WalletClient } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import { abi as abiVault } from "@/ABI/Union/UnionVault";
import { maxApproveViem } from "@/Wallet";
import type { ZapDeposit, Swap } from "@Pounders/Models";
import { getBalance, getDecimals } from "@Pounders/Zaps/Helpers";

import { CvxFxsAddress, UnionFxsVaultAddress } from "@/Util/Addresses";

import logoFXS from "@/Assets/Icons/Tokens/fxs.png";

export function uFxsDepositZaps(
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

    await maxApproveViem(
      client,
      wallet,
      CvxFxsAddress,
      address,
      UnionFxsVaultAddress,
      input
    );

    const args = [address, input] as const;
    const hash = await wallet.writeContract({
      chain: wallet.chain!,
      account: wallet.account,
      abi: abiVault,
      address: UnionFxsVaultAddress,
      functionName: "deposit",
      args,
    });

    return waitForTransactionReceipt(client, { hash });
  };

  // Zaps
  const cvxFXS: ZapDeposit = {
    logo: logoFXS,
    label: "cvxFXS",
    zap: () => deposit(),
    depositSymbol: "cvxFXS",
    depositBalance: () => getBalance(getClient, getAddress, CvxFxsAddress),
    depositDecimals: () => getDecimals(getClient, CvxFxsAddress),
  };

  const swap: Swap = {
    buy: "cvxFXS",
    sell: "ETH",
  };

  const options = [cvxFXS, swap];

  return options;
}
