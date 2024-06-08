import { type JsonRpcSigner } from "@ethersproject/providers";
import { type Address, type PublicClient, type WalletClient } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import { abi as abiVaultPirex } from "@/ABI/Union/UnionVaultPirex";
import { abi as abiZaps } from "@/ABI/Union/ZapsUCvx";
import { abi as abiCurve2 } from "@/ABI/Curve/CurveV2FactoryPool";
import { maxApproveViem } from "@/Wallet";
import type { ZapDeposit, Swap } from "@Pounders/Models";
import { getBalance, getDecimals } from "@Pounders/Zaps/Helpers";
import { DefiLlamaService } from "@/Services";
import { getPxCvxPriceViem } from "@/Util";
import { calcMinAmountOut } from "@Pounders/Util/MinAmountOutHelper";

import {
  CvxAddress,
  LPxCvxFactoryAddress,
  ZapsUCvxAddress,
} from "@/Util/Addresses";

import logoCVX from "@/Assets/Icons/Tokens/cvx.svg";

async function shouldLock(
  client: PublicClient | undefined,
  input: bigint
): Promise<boolean> {
  if (!client) {
    return false;
  }

  const dy = await client.readContract({
    abi: abiCurve2,
    address: LPxCvxFactoryAddress,
    functionName: "get_dy",
    args: [0n, 1n, input],
  });

  // Lock when dy (what you get when swapping) is less than the input.
  return input >= dy;
}

// eslint-disable-next-line max-lines-per-function
export function uCvxDepositZaps(
  getClient: () => PublicClient | undefined,
  getWallet: () => Promise<WalletClient | undefined>,
  getAddress: () => Address | undefined,
  getInput: () => bigint | null
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
      PxCvxAddress,
      address,
      UnionCvxVaultAddress,
      input
    );

    const args = [input, address] as const;
    const hash = await wallet.writeContract({
      chain: wallet.chain!,
      account: wallet.account,
      abi: abiVaultPirex,
      address: UnionCvxVaultAddress,
      functionName: "deposit",
      args,
    });

    return waitForTransactionReceipt(client, { hash });
  };

  const depositFromCvx = async (minAmountOut: bigint) => {
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
      CvxAddress,
      address,
      ZapsUCvxAddress,
      input
    );

    const lock = await shouldLock(client, input);
    const args = [input, minAmountOut, address, lock] as const;
    const hash = await wallet.writeContract({
      chain: wallet.chain!,
      account: wallet.account,
      abi: abiZaps,
      address: ZapsUCvxAddress,
      functionName: "depositFromCvx",
      args,
    });

    return waitForTransactionReceipt(client, { hash });
  };

  // Zaps
  const cvx: ZapDeposit = {
    logo: logoCVX,
    label: "CVX",
    zap: (minAmountOut?: bigint) => depositFromCvx(minAmountOut ?? 0n),
    depositSymbol: "CVX",
    depositBalance: () => getBalance(getClient, getAddress, CvxAddress),
    depositDecimals: () => getDecimals(getClient, CvxAddress),
    getMinAmountOut: async (
      host: string,
      client: JsonRpcSigner | PublicClient,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const llamaService = new DefiLlamaService(host);

      const cvx = await llamaService
        .getPrice(CvxAddress)
        .then((x) => x.price)
        .catch(() => Infinity);

      const pxcvx = await getPxCvxPriceViem(
        llamaService,
        client as PublicClient
      )
        .then((x) => x)
        .catch(() => Infinity);

      return calcMinAmountOut(input, cvx, pxcvx, slippage);
    },
  };

  const pxCVX: ZapDeposit = {
    logo: logoCVX,
    label: "pxCVX",
    zap: () => deposit(),
    depositSymbol: "pxCVX",
    depositBalance: () => getBalance(getClient, getAddress, PxCvxAddress),
    depositDecimals: () => getDecimals(getClient, PxCvxAddress),
  };

  const swap: Swap = {
    buy: "CVX",
    sell: "ETH",
  };

  const options = [cvx, pxCVX, swap];

  return options;
}
