import { type Address, type PublicClient, type WalletClient } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import { abi as abiZaps } from "@/ABI/Union/ZapsUFxsLp";
import { maxApprove } from "@/Wallet";
import { DefiLlamaService } from "@/Services";
import { getCvxFxsLpPrice, getCvxFxsPrice } from "@/Util";
import type { ZapDeposit, Swap } from "@Pounders/Models";
import {
  getBalance,
  getDecimals,
  calcMinAmountOut,
} from "@Pounders/Zaps/Helpers";

import {
  ZapsUFxsAddressV1,
  CvxFxsFactoryERC20Address,
  CvxFxsAddress,
  FxsAddress,
} from "@/Util/Addresses";

import logoFXS from "@/Assets/Icons/Tokens/fxs.png";

// eslint-disable-next-line max-lines-per-function
export function uFxsLpDepositZaps(
  getClient: () => PublicClient | undefined,
  getWallet: () => Promise<WalletClient | undefined>,
  getAddress: () => Address | undefined,
  getInput: () => bigint | undefined
): (ZapDeposit | Swap)[] {
  const depositFromFxs = async (minAmountOut: bigint) => {
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
      FxsAddress,
      address,
      ZapsUFxsAddressV1,
      input
    );

    const args = [input, 0n, minAmountOut, address] as const;
    const hash = await wallet.writeContract({
      chain: wallet.chain!,
      account: wallet.account,
      abi: abiZaps,
      address: ZapsUFxsAddressV1,
      functionName: "claimFromVaultAsUnderlying",
      args,
    });

    return waitForTransactionReceipt(client, { hash });
  };

  const depositFromCvxFxs = async (minAmountOut: bigint) => {
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
      CvxFxsAddress,
      address,
      ZapsUFxsAddressV1,
      input
    );

    const args = [0n, input, minAmountOut, address] as const;
    const hash = await wallet.writeContract({
      chain: wallet.chain!,
      account: wallet.account,
      abi: abiZaps,
      address: ZapsUFxsAddressV1,
      functionName: "claimFromVaultAsUnderlying",
      args,
    });

    return waitForTransactionReceipt(client, { hash });
  };

  const depositFromLp = async () => {
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
      CvxFxsFactoryERC20Address,
      address,
      ZapsUFxsAddressV1,
      input
    );

    const args = [input, 0n, 0n, 0n, address] as const;
    const hash = await wallet.writeContract({
      chain: wallet.chain!,
      account: wallet.account,
      abi: abiZaps,
      address: ZapsUFxsAddressV1,
      functionName: "depositWithRewards",
      args,
    });

    return waitForTransactionReceipt(client, { hash });
  };

  // Zaps
  const fxs: ZapDeposit = {
    logo: logoFXS,
    label: "FXS",
    zap: (minAmountOut?: bigint) => depositFromFxs(minAmountOut ?? 0n),
    depositSymbol: "FXS",
    depositBalance: () => getBalance(getClient, getAddress, FxsAddress),
    depositDecimals: () => getDecimals(getClient, FxsAddress),
    getMinAmountOut: async (
      host: string,
      client: PublicClient,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const llamaService = new DefiLlamaService(host);

      const fxs = await llamaService
        .getPrice(FxsAddress)
        .then((x) => x.price)
        .catch(() => Infinity);

      const cvxfxslp = await getCvxFxsLpPrice(llamaService, client)
        .then((x) => x)
        .catch(() => Infinity);

      return calcMinAmountOut(input, fxs, cvxfxslp, slippage);
    },
  };

  const cvxFXS: ZapDeposit = {
    logo: logoFXS,
    label: "cvxFXS",
    zap: (minAmountOut?: bigint) => depositFromCvxFxs(minAmountOut ?? 0n),
    depositSymbol: "cvxFXS",
    depositBalance: () => getBalance(getClient, getAddress, CvxFxsAddress),
    depositDecimals: () => getDecimals(getClient, CvxFxsAddress),
    getMinAmountOut: async (
      host: string,
      client: PublicClient,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const llamaService = new DefiLlamaService(host);

      const cvxfxs = await getCvxFxsPrice(llamaService, client)
        .then((x) => x)
        .catch(() => Infinity);

      const cvxfxslp = await getCvxFxsLpPrice(llamaService, client)
        .then((x) => x)
        .catch(() => Infinity);

      return calcMinAmountOut(input, cvxfxs, cvxfxslp, slippage);
    },
  };

  const cvxFXSLP: ZapDeposit = {
    logo: logoFXS,
    label: "cvxFXS LP token",
    zap: () => depositFromLp(),
    depositSymbol: "cvxFXSFXS-f",
    depositBalance: () =>
      getBalance(getClient, getAddress, CvxFxsFactoryERC20Address),
    depositDecimals: () => getDecimals(getClient, CvxFxsFactoryERC20Address),
  };

  const options = [fxs, cvxFXS, cvxFXSLP];

  return options;
}
