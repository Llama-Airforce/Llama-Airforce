import { abi as abiCurve2 } from "@/ABI/Curve/CurveV2FactoryPool";
import { abi as abiVaultPirex } from "@/ABI/Union/UnionVaultPirex";
import { abi as abiZaps } from "@/ABI/Union/ZapsUCvx";
import logoCVX from "@/Assets/Icons/Tokens/cvx.svg";
import { PriceService } from "@/Services";
import type { Address } from "@/types/address";
import { getPxCvxPrice } from "@/Utils/Price";
import { maxApprove } from "@/Utils/Wallet";
import type { ZapDeposit } from "@Pounders/Models";
import {
  getBalance,
  getDecimals,
  calcMinAmountOut,
} from "@Pounders/Zaps/Helpers";

async function shouldLock(config: Config, input: bigint): Promise<boolean> {
  const dy = await readContract(config, {
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
  getConfig: () => Config,
  getAddress: () => Address | undefined,
  getInput: () => bigint | undefined
): ZapDeposit[] {
  const deposit = async () => {
    const config = getConfig();
    const address = getAddress();
    const input = getInput();

    if (!address || !input) {
      throw new Error("Unable to construct deposit zaps");
    }

    await maxApprove(
      config,
      PxCvxAddress,
      address,
      UnionCvxVaultAddress,
      input
    );

    const args = [input, address] as const;
    const hash = await writeContract(config, {
      abi: abiVaultPirex,
      address: UnionCvxVaultAddress,
      functionName: "deposit",
      args,
    });

    return waitForTransactionReceipt(config, { hash });
  };

  const depositFromCvx = async (minAmountOut: bigint) => {
    const config = getConfig();
    const address = getAddress();
    const input = getInput();

    if (!address || !input) {
      throw new Error("Unable to construct deposit zaps");
    }

    await maxApprove(config, CvxAddress, address, ZapsUCvxAddress, input);

    const lock = await shouldLock(config, input);
    const args = [input, minAmountOut, address, lock] as const;
    const hash = await writeContract(config, {
      abi: abiZaps,
      address: ZapsUCvxAddress,
      functionName: "depositFromCvx",
      args,
    });

    return waitForTransactionReceipt(config, { hash });
  };

  // Zaps
  const cvx: ZapDeposit = {
    logo: logoCVX,
    label: "CVX",
    zap: (minAmountOut?: bigint) => depositFromCvx(minAmountOut ?? 0n),
    depositSymbol: "CVX",
    depositBalance: () => getBalance(getConfig, getAddress, CvxAddress),
    depositDecimals: () => getDecimals(getConfig, CvxAddress),
    getMinAmountOut: async (
      host: string,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const priceService = new PriceService(Promise.resolve(host));

      const config = getConfig();
      const client = getPublicClient(config);
      if (!client) throw Error("Cannot create public viem client");

      const cvx = await priceService
        .getPrice(CvxAddress)
        .then((x) => x?.price ?? Infinity)
        .catch(() => Infinity);

      const pxcvx = await getPxCvxPrice(priceService, client)
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
    depositBalance: () => getBalance(getConfig, getAddress, PxCvxAddress),
    depositDecimals: () => getDecimals(getConfig, PxCvxAddress),
  };

  const options = [cvx, pxCVX];

  return options;
}
