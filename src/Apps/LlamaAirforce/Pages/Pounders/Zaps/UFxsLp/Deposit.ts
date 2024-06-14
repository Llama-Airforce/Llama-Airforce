import { type Address } from "viem";
import {
  type Config,
  writeContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
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
  getConfig: () => Config,
  getAddress: () => Address | undefined,
  getInput: () => bigint | undefined
): (ZapDeposit | Swap)[] {
  const depositFromFxs = async (minAmountOut: bigint) => {
    const config = getConfig();
    const address = getAddress();
    const input = getInput();

    if (!address || !input) {
      throw new Error("Unable to construct deposit zaps");
    }

    await maxApprove(config, FxsAddress, address, ZapsUFxsAddressV1, input);

    const args = [input, 0n, minAmountOut, address] as const;
    const hash = await writeContract(config, {
      abi: abiZaps,
      address: ZapsUFxsAddressV1,
      functionName: "claimFromVaultAsUnderlying",
      args,
    });

    return waitForTransactionReceipt(config, { hash });
  };

  const depositFromCvxFxs = async (minAmountOut: bigint) => {
    const config = getConfig();
    const address = getAddress();
    const input = getInput();

    if (!address || !input) {
      throw new Error("Unable to construct deposit zaps");
    }

    await maxApprove(config, CvxFxsAddress, address, ZapsUFxsAddressV1, input);

    const args = [0n, input, minAmountOut, address] as const;
    const hash = await writeContract(config, {
      abi: abiZaps,
      address: ZapsUFxsAddressV1,
      functionName: "claimFromVaultAsUnderlying",
      args,
    });

    return waitForTransactionReceipt(config, { hash });
  };

  const depositFromLp = async () => {
    const config = getConfig();
    const address = getAddress();
    const input = getInput();

    if (!address || !input) {
      throw new Error("Unable to construct deposit zaps");
    }

    await maxApprove(
      config,
      CvxFxsFactoryERC20Address,
      address,
      ZapsUFxsAddressV1,
      input
    );

    const args = [input, 0n, 0n, 0n, address] as const;
    const hash = await writeContract(config, {
      abi: abiZaps,
      address: ZapsUFxsAddressV1,
      functionName: "depositWithRewards",
      args,
    });

    return waitForTransactionReceipt(config, { hash });
  };

  // Zaps
  const fxs: ZapDeposit = {
    logo: logoFXS,
    label: "FXS",
    zap: (minAmountOut?: bigint) => depositFromFxs(minAmountOut ?? 0n),
    depositSymbol: "FXS",
    depositBalance: () => getBalance(getConfig, getAddress, FxsAddress),
    depositDecimals: () => getDecimals(getConfig, FxsAddress),
    getMinAmountOut: async (
      host: string,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const llamaService = new DefiLlamaService(host);

      const fxs = await llamaService
        .getPrice(FxsAddress)
        .then((x) => x.price)
        .catch(() => Infinity);

      const cvxfxslp = await getCvxFxsLpPrice(llamaService, getConfig())
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
    depositBalance: () => getBalance(getConfig, getAddress, CvxFxsAddress),
    depositDecimals: () => getDecimals(getConfig, CvxFxsAddress),
    getMinAmountOut: async (
      host: string,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const llamaService = new DefiLlamaService(host);

      const config = getConfig();

      const cvxfxs = await getCvxFxsPrice(llamaService, config)
        .then((x) => x)
        .catch(() => Infinity);

      const cvxfxslp = await getCvxFxsLpPrice(llamaService, config)
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
      getBalance(getConfig, getAddress, CvxFxsFactoryERC20Address),
    depositDecimals: () => getDecimals(getConfig, CvxFxsFactoryERC20Address),
  };

  const options = [fxs, cvxFXS, cvxFXSLP];

  return options;
}
