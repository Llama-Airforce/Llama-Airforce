import { type Address, type PublicClient, type WalletClient } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import { abi as abiVaultPirex } from "@/ABI/Union/UnionVaultPirex";
import { abi as abiZaps } from "@/ABI/Union/ZapsUCvx";
import { maxApprove } from "@/Wallet";
import { DefiLlamaService } from "@/Services";
import type { ZapWithdraw, Swap } from "@Pounders/Models";
import { calcMinAmountOut } from "@Pounders/Zaps/Helpers";
import { getUCvxPrice } from "@Pounders/Zaps/UCvx/PriceHelper";

import {
  CvxAddress,
  UnionCvxVaultAddress,
  ZapsUCvxAddress,
} from "@/Util/Addresses";

import logoCVX from "@/Assets/Icons/Tokens/cvx.svg";

// eslint-disable-next-line max-lines-per-function
export function uCvxWithdrawZaps(
  getClient: () => PublicClient | undefined,
  getWallet: () => Promise<WalletClient | undefined>,
  getAddress: () => Address | undefined,
  getInput: () => bigint | undefined
): (ZapWithdraw | Swap)[] {
  const withdraw = async () => {
    const client = getClient();
    const wallet = await getWallet();
    const address = getAddress();
    const input = getInput();

    if (!address || !input || !client || !wallet?.account) {
      throw new Error("Unable to construct withdraw zaps");
    }

    const args = [input, address, address] as const;
    const hash = await wallet.writeContract({
      chain: wallet.chain!,
      account: wallet.account,
      abi: abiVaultPirex,
      address: UnionCvxVaultAddress,
      functionName: "redeem",
      args,
    });

    return waitForTransactionReceipt(client, { hash });
  };

  const withdrawAsCvx = async (minAmountOut: bigint) => {
    const client = getClient();
    const wallet = await getWallet();
    const address = getAddress();
    const input = getInput();

    if (!address || !input || !client || !wallet?.account) {
      throw new Error("Unable to construct withdraw zaps");
    }

    await maxApprove(
      client,
      wallet,
      UnionCvxVaultAddress,
      address,
      ZapsUCvxAddress,
      input
    );

    const args = [input, minAmountOut, address] as const;
    const hash = await wallet.writeContract({
      chain: wallet.chain!,
      account: wallet.account,
      abi: abiZaps,
      address: ZapsUCvxAddress,
      functionName: "claimFromVaultAsCvx",
      args,
    });

    return waitForTransactionReceipt(client, { hash });
  };

  // Zaps
  const pxCVX: ZapWithdraw = {
    logo: logoCVX,
    label: "pxCVX",
    withdrawSymbol: "pxCVX",
    withdrawDecimals: () => Promise.resolve(18n),
    zap: () => withdraw(),
  };

  const cvx: ZapWithdraw = {
    logo: logoCVX,
    label: "CVX",
    withdrawSymbol: "CVX",
    withdrawDecimals: () => Promise.resolve(18n),
    zap: (minAmountOut?: bigint) => withdrawAsCvx(minAmountOut ?? 0n),
    getMinAmountOut: async (
      host: string,
      client: PublicClient,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const llamaService = new DefiLlamaService(host);

      const cvx = await llamaService
        .getPrice(CvxAddress)
        .then((x) => x.price)
        .catch(() => Infinity);

      const ucvx = await getUCvxPrice(llamaService, client);

      return calcMinAmountOut(input, ucvx, cvx, slippage);
    },
  };

  const swap: Swap = {
    buy: "ETH",
    sell: "CVX",
  };

  const options = [cvx, pxCVX, swap];

  return options;
}
