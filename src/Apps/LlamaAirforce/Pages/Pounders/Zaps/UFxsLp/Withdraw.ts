import { type Address, type PublicClient, type WalletClient } from "viem";
import { type JsonRpcSigner } from "@ethersproject/providers";
import { waitForTransactionReceipt } from "viem/actions";
import { abi as abiVault } from "@/ABI/Union/UnionVault";
import { abi as abiZaps } from "@/ABI/Union/ZapsUFxsLp";
import { maxApproveViem } from "@/Wallet";
import type { ZapWithdraw, Swap } from "@Pounders/Models";
import { DefiLlamaService } from "@/Services";
import { getCvxFxsLpPriceViem, getCvxFxsPriceViem } from "@/Util";
import { calcMinAmountOut } from "@Pounders/Util/MinAmountOutHelper";

import {
  FxsAddress,
  UnionFxsVaultAddressV1,
  ZapsUFxsAddressV1,
} from "@/Util/Addresses";

import logoFXS from "@/Assets/Icons/Tokens/fxs.png";

// eslint-disable-next-line max-lines-per-function
export function uFxsLpWithdrawZaps(
  getClient: () => PublicClient | undefined,
  getWallet: () => Promise<WalletClient | undefined>,
  getAddress: () => Address | undefined,
  getInput: () => bigint | null
): (ZapWithdraw | Swap)[] {
  const withdrawAsFxs = async (minAmountOut: bigint) => {
    const client = getClient();
    const wallet = await getWallet();
    const address = getAddress();
    const input = getInput();

    if (!address || !input || !client || !wallet?.account) {
      throw new Error("Unable to construct withdraw zaps");
    }

    await maxApproveViem(
      client,
      wallet,
      UnionFxsVaultAddressV1,
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

  const withdrawAsCvxFxs = async (minAmountOut: bigint) => {
    const client = getClient();
    const wallet = await getWallet();
    const address = getAddress();
    const input = getInput();

    if (!address || !input || !client || !wallet?.account) {
      throw new Error("Unable to construct withdraw zaps");
    }

    await maxApproveViem(
      client,
      wallet,
      UnionFxsVaultAddressV1,
      address,
      ZapsUFxsAddressV1,
      input
    );

    const args = [input, 1n, minAmountOut, address] as const;
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

  const withdrawAsLp = async () => {
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
      address: UnionFxsVaultAddressV1,
      functionName: "withdraw",
      args,
    });

    return waitForTransactionReceipt(client, { hash });
  };

  // Zaps
  const fxs: ZapWithdraw = {
    logo: logoFXS,
    label: "FXS",
    withdrawSymbol: "FXS",
    withdrawDecimals: () => Promise.resolve(18n),
    zap: (minAmountOut?: bigint) => withdrawAsFxs(minAmountOut ?? 0n),
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

      return calcMinAmountOut(input, cvxfxslp, fxs, slippage);
    },
  };

  const cvxFXS: ZapWithdraw = {
    logo: logoFXS,
    label: "cvxFXS",
    withdrawSymbol: "cvxFXS",
    withdrawDecimals: () => Promise.resolve(18n),
    zap: (minAmountOut?: bigint) => withdrawAsCvxFxs(minAmountOut ?? 0n),
    getMinAmountOut: async (
      host: string,
      client: JsonRpcSigner | PublicClient,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const llamaService = new DefiLlamaService(host);

      const cvxfxs = await getCvxFxsPriceViem(
        llamaService,
        client as PublicClient
      )
        .then((x) => x)
        .catch(() => Infinity);

      const cvxfxslp = await getCvxFxsLpPriceViem(
        llamaService,
        client as PublicClient
      )
        .then((x) => x)
        .catch(() => Infinity);

      return calcMinAmountOut(input, cvxfxslp, cvxfxs, slippage);
    },
  };

  const cvxFXSLP: ZapWithdraw = {
    logo: logoFXS,
    label: "cvxFXS LP token",
    withdrawSymbol: "cvxFXSFXS-f",
    withdrawDecimals: () => Promise.resolve(18n),
    zap: () => withdrawAsLp(),
  };

  const options = [fxs, cvxFXS, cvxFXSLP];

  return options;
}
