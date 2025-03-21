import { abi as abiZaps } from "@/ABI/Union/ZapsUFxsLp";
import logoFXS from "@/Assets/Icons/Tokens/fxs.png";
import { PriceService } from "@/Services";
import type { Address } from "@/types/address";
import { getCvxFxsLpPrice, getCvxFxsPrice } from "@/Utils/Price";
import { maxApprove } from "@/Utils/Wallet";
import type { ZapDeposit } from "@Pounders/Models";
import {
  getBalance,
  getDecimals,
  calcMinAmountOut,
} from "@Pounders/Zaps/Helpers";

// eslint-disable-next-line max-lines-per-function
export function uFxsLpDepositZaps(
  getConfig: () => Config,
  getAddress: () => Address | undefined,
  getInput: () => bigint | undefined
): ZapDeposit[] {
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
      const priceService = new PriceService(Promise.resolve(host));

      const config = getConfig();
      const client = getPublicClient(config);
      if (!client) throw Error("Cannot create public viem client");

      const fxs = await priceService
        .getPrice(FxsAddress)
        .then((x) => x?.price ?? Infinity)
        .catch(() => Infinity);

      const cvxfxslp = await getCvxFxsLpPrice(priceService, client)
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
      const priceService = new PriceService(Promise.resolve(host));

      const config = getConfig();
      const client = getPublicClient(config);
      if (!client) throw Error("Cannot create public viem client");

      const cvxfxs = await getCvxFxsPrice(priceService, client)
        .then((x) => x)
        .catch(() => Infinity);

      const cvxfxslp = await getCvxFxsLpPrice(priceService, client)
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
