import type { Address } from "@/Types/Address";
import { abi as abiVault } from "@/ABI/Union/UnionVault";
import { abi as abiZaps } from "@/ABI/Union/ZapsUFxsLp";
import { maxApprove } from "@/Wallet";
import type { ZapWithdraw } from "@Pounders/Models";
import { calcMinAmountOut } from "@Pounders/Zaps/Helpers";
import { DefiLlamaService } from "@/Services";
import { getCvxFxsLpPrice, getCvxFxsPrice } from "@/Util";

import logoFXS from "@/Assets/Icons/Tokens/fxs.png";

// eslint-disable-next-line max-lines-per-function
export function uFxsLpWithdrawZaps(
  getConfig: () => Config,
  getAddress: () => Address | undefined,
  getInput: () => bigint | undefined
): ZapWithdraw[] {
  const withdrawAsFxs = async (minAmountOut: bigint) => {
    const config = getConfig();
    const address = getAddress();
    const input = getInput();

    if (!address || !input) {
      throw new Error("Unable to construct withdraw zaps");
    }

    await maxApprove(
      config,
      UnionFxsVaultAddressV1,
      address,
      ZapsUFxsAddressV1,
      input
    );

    const args = [input, 0n, minAmountOut, address] as const;
    const hash = await writeContract(config, {
      abi: abiZaps,
      address: ZapsUFxsAddressV1,
      functionName: "claimFromVaultAsUnderlying",
      args,
    });

    return waitForTransactionReceipt(config, { hash });
  };

  const withdrawAsCvxFxs = async (minAmountOut: bigint) => {
    const config = getConfig();
    const address = getAddress();
    const input = getInput();

    if (!address || !input) {
      throw new Error("Unable to construct withdraw zaps");
    }

    await maxApprove(
      config,
      UnionFxsVaultAddressV1,
      address,
      ZapsUFxsAddressV1,
      input
    );

    const args = [input, 1n, minAmountOut, address] as const;
    const hash = await writeContract(config, {
      abi: abiZaps,
      address: ZapsUFxsAddressV1,
      functionName: "claimFromVaultAsUnderlying",
      args,
    });

    return waitForTransactionReceipt(config, { hash });
  };

  const withdrawAsLp = async () => {
    const config = getConfig();
    const address = getAddress();
    const input = getInput();

    if (!address || !input) {
      throw new Error("Unable to construct withdraw zaps");
    }

    const args = [address, input] as const;
    const hash = await writeContract(config, {
      abi: abiVault,
      address: UnionFxsVaultAddressV1,
      functionName: "withdraw",
      args,
    });

    return waitForTransactionReceipt(config, { hash });
  };

  // Zaps
  const fxs: ZapWithdraw = {
    logo: logoFXS,
    label: "FXS",
    withdrawSymbol: "FXS",
    withdrawDecimals: () => Promise.resolve(18n),
    zap: (minAmountOut?: bigint) => withdrawAsFxs(minAmountOut ?? 0n),
    getMinAmountOut: async (
      _host: string,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const llamaService = new DefiLlamaService();

      const config = getConfig();
      const client = getPublicClient(config);
      if (!client) throw Error("Cannot create public viem client");

      const fxs = await llamaService
        .getPrice(FxsAddress)
        .then((x) => x.price)
        .catch(() => Infinity);

      const cvxfxslp = await getCvxFxsLpPrice(llamaService, client)
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
      _host: string,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const llamaService = new DefiLlamaService();

      const config = getConfig();
      const client = getPublicClient(config);
      if (!client) throw Error("Cannot create public viem client");

      const cvxfxs = await getCvxFxsPrice(llamaService, client)
        .then((x) => x)
        .catch(() => Infinity);

      const cvxfxslp = await getCvxFxsLpPrice(llamaService, client)
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
