import { type PublicClient } from "viem";
import {
  type JsonRpcProvider,
  type JsonRpcSigner,
} from "@ethersproject/providers";
import { maxApprove } from "@/Wallet";
import {
  CurveV2FactoryPool__factory,
  type ERC20,
  ERC20__factory,
  type UnionVaultPirex,
  ZapsUCvx__factory,
} from "@/Contracts";
import { DefiLlamaService } from "@/Services";
import { getPxCvxPrice } from "@/Util";
import {
  CvxAddress,
  LPxCvxFactoryAddress,
  ZapsUCvxAddress,
} from "@/Util/Addresses";
import type { ZapDeposit, Swap } from "@Pounders/Models";
import { calcMinAmountOut } from "@Pounders/Util/MinAmountOutHelper";

import logoCVX from "@/Assets/Icons/Tokens/cvx.svg";

async function shouldLock(
  provider: JsonRpcProvider | undefined,
  input: bigint
): Promise<boolean> {
  if (!provider) {
    return false;
  }

  const curvePool = CurveV2FactoryPool__factory.connect(
    LPxCvxFactoryAddress,
    provider
  );

  const dy = await curvePool.get_dy(0, 1, input);

  // Lock when dy (what you get when swapping) is less than the input.
  return input >= dy.toBigInt();
}

// eslint-disable-next-line max-lines-per-function
export function uCvxDepositZaps(
  getSigner: () => JsonRpcSigner | undefined,
  getAddress: () => string | undefined,
  getInput: () => bigint | null,
  getVault: () => UnionVaultPirex | undefined,
  getAssetTkn: () => ERC20 | undefined
): (ZapDeposit | Swap)[] {
  const deposit = async () => {
    const address = getAddress();
    const vault = getVault();
    const input = getInput();
    const atkn = getAssetTkn();

    if (!address || !vault || !input || !atkn) {
      throw new Error("Unable to construct deposit zaps");
    }

    await maxApprove(atkn, address, vault.address, input);

    const ps = [input, address] as const;
    const estimate = await vault.estimateGas.deposit(...ps);
    const tx = await vault.deposit(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const depositFactory = async (depositTkn: string | null) => {
    const address = getAddress();
    const vault = getVault();
    const input = getInput();
    const signer = getSigner();

    if (!address || !vault || !input || !signer) {
      throw new Error("Unable to construct extra zaps");
    }

    if (depositTkn) {
      const depositERC20 = ERC20__factory.connect(depositTkn, signer);

      await maxApprove(depositERC20, address, ZapsUCvxAddress, input);
    }

    return {
      zaps: ZapsUCvx__factory.connect(ZapsUCvxAddress, signer),
      address,
      input,
    };
  };

  const depositFromCvx = async (minAmountOut: bigint) => {
    const x = await depositFactory(CvxAddress);
    const lock = await shouldLock(getSigner()?.provider, x.input);
    const ps = [x.input, minAmountOut, x.address, lock] as const;

    const estimate = await x.zaps.estimateGas.depositFromCvx(...ps);

    const tx = await x.zaps.depositFromCvx(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  // Zaps
  const cvx: ZapDeposit = {
    logo: logoCVX,
    label: "CVX",
    zap: (minAmountOut?: bigint) => depositFromCvx(minAmountOut ?? 0n),
    depositSymbol: "CVX",
    depositBalance: () => {
      const address = getAddress();
      const provider = getSigner()?.provider;

      if (!address || !provider) {
        throw new Error("Unable to construct deposit zap balance");
      }

      const depositERC20 = ERC20__factory.connect(CvxAddress, provider);
      return depositERC20.balanceOf(address).then((x) => x.toBigInt());
    },
    depositDecimals: () => {
      const provider = getSigner()?.provider;

      if (!provider) {
        throw new Error("Unable to construct deposit zap decimals");
      }

      const depositERC20 = ERC20__factory.connect(CvxAddress, provider);
      return depositERC20.decimals().then((x) => BigInt(x));
    },
    getMinAmountOut: async (
      host: string,
      signer: JsonRpcSigner | PublicClient,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const llamaService = new DefiLlamaService(host);

      const cvx = await llamaService
        .getPrice(CvxAddress)
        .then((x) => x.price)
        .catch(() => Infinity);

      const factory = CurveV2FactoryPool__factory.connect(
        LPxCvxFactoryAddress,
        signer as JsonRpcSigner
      );
      const pxcvx = await getPxCvxPrice(llamaService, factory)
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
    depositBalance: async () => {
      const address = getAddress();
      const atkn = getAssetTkn();

      if (!address || !atkn) {
        throw new Error("Unable to construct deposit zap balance");
      }

      return await atkn.balanceOf(address).then((x) => x.toBigInt());
    },
    depositDecimals: async () => {
      const atkn = getAssetTkn();

      if (!atkn) {
        throw new Error("Unable to construct deposit zap decimals");
      }

      return await atkn.decimals().then((x) => BigInt(x));
    },
  };

  const swap: Swap = {
    buy: "CVX",
    sell: "ETH",
  };

  const options = [cvx, pxCVX, swap];

  return options;
}
