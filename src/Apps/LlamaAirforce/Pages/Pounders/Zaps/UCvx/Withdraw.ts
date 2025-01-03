import type { Address } from "@/Types/Address";
import { abi as abiVaultPirex } from "@/ABI/Union/UnionVaultPirex";
import { abi as abiZaps } from "@/ABI/Union/ZapsUCvx";
import { maxApprove } from "@/Utils/Wallet";
import { DefiLlamaService } from "@/Services";
import type { ZapWithdraw } from "@Pounders/Models";
import { calcMinAmountOut } from "@Pounders/Zaps/Helpers";
import { getUCvxPrice } from "@Pounders/Zaps/UCvx/PriceHelper";

import logoCVX from "@/Assets/Icons/Tokens/cvx.svg";

export function uCvxWithdrawZaps(
  getConfig: () => Config,
  getAddress: () => Address | undefined,
  getInput: () => bigint | undefined
): ZapWithdraw[] {
  const withdraw = async () => {
    const config = getConfig();
    const address = getAddress();
    const input = getInput();

    if (!address || !input) {
      throw new Error("Unable to construct withdraw zaps");
    }

    const args = [input, address, address] as const;
    const hash = await writeContract(config, {
      abi: abiVaultPirex,
      address: UnionCvxVaultAddress,
      functionName: "redeem",
      args,
    });

    return waitForTransactionReceipt(config, { hash });
  };

  const withdrawAsCvx = async (minAmountOut: bigint) => {
    const config = getConfig();
    const address = getAddress();
    const input = getInput();

    if (!address || !input) {
      throw new Error("Unable to construct withdraw zaps");
    }

    await maxApprove(
      config,
      UnionCvxVaultAddress,
      address,
      ZapsUCvxAddress,
      input
    );

    const args = [input, minAmountOut, address] as const;
    const hash = await writeContract(config, {
      abi: abiZaps,
      address: ZapsUCvxAddress,
      functionName: "claimFromVaultAsCvx",
      args,
    });

    return waitForTransactionReceipt(config, { hash });
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
      _host: string,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const llamaService = new DefiLlamaService();

      const cvx = await llamaService
        .getPrice(CvxAddress)
        .then((x) => x.price)
        .catch(() => Infinity);

      const ucvx = await getUCvxPrice(llamaService, getConfig());

      return calcMinAmountOut(input, ucvx, cvx, slippage);
    },
  };

  const options = [cvx, pxCVX];

  return options;
}
