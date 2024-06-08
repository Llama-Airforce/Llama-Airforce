import { type Address, type PublicClient, type WalletClient } from "viem";
import { type JsonRpcSigner } from "@ethersproject/providers";
import { waitForTransactionReceipt } from "viem/actions";
import { abi as abiZaps } from "@/ABI/Union/ZapsUFxsLp";
import { maxApproveViem } from "@/Wallet";
import { DefiLlamaService } from "@/Services";
import { getCvxFxsLpPriceViem, getCvxFxsPriceViem } from "@/Util";
import type { ZapDeposit, Swap } from "@Pounders/Models";
import { calcMinAmountOut } from "@Pounders/Util/MinAmountOutHelper";
import { getBalance, getDecimals } from "@Pounders/Zaps/Helpers";

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
  getInput: () => bigint | null
): (ZapDeposit | Swap)[] {
  const depositFromFxs = async (minAmountOut: bigint) => {
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

    await maxApproveViem(
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

    await maxApproveViem(
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
      client: JsonRpcSigner | PublicClient,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const llamaService = new DefiLlamaService(host);

      const fxs = await llamaService
        .getPrice(FxsAddress)
        .then((x) => x.price)
        .catch(() => Infinity);

      const cvxfxslp = await getCvxFxsLpPriceViem(
        llamaService,
        client as PublicClient
      )
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
      signer: JsonRpcSigner | PublicClient,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const llamaService = new DefiLlamaService(host);

      const cvxfxs = await getCvxFxsPriceViem(
        llamaService,
        signer as PublicClient
      )
        .then((x) => x)
        .catch(() => Infinity);

      const cvxfxslp = await getCvxFxsLpPriceViem(
        llamaService,
        signer as PublicClient
      )
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
