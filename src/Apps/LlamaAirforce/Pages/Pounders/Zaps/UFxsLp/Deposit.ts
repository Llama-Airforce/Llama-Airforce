import { type JsonRpcSigner } from "@ethersproject/providers";
import { maxApprove } from "@/Wallet";
import {
  type ERC20,
  ERC20__factory,
  ZapsUFxsLp__factory,
  type UnionVault,
  CurveV2FactoryPool__factory,
} from "@/Contracts";
import { DefiLlamaService } from "@/Services";
import { getCvxFxsLpPrice, getCvxFxsPrice } from "@/Util";
import {
  ZapsUFxsAddressV1,
  CvxFxsFactoryERC20Address,
  CvxFxsAddress,
  FxsAddress,
  CvxFxsFactoryAddress,
} from "@/Util/Addresses";
import type { ZapDeposit, Swap } from "@Pounders/Models";
import { calcMinAmountOut } from "@Pounders/Util/MinAmountOutHelper";

import logoFXS from "@/Assets/Icons/Tokens/fxs.png";

// eslint-disable-next-line max-lines-per-function
export function uFxsLpDepositZaps(
  getSigner: () => JsonRpcSigner | undefined,
  getAddress: () => string | undefined,
  getInput: () => bigint | null,
  getVault: () => UnionVault | undefined,
  getAssetTkn: () => ERC20 | undefined
): (ZapDeposit | Swap)[] {
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

      await maxApprove(depositERC20, address, ZapsUFxsAddressV1, input);
    }

    return {
      zaps: ZapsUFxsLp__factory.connect(ZapsUFxsAddressV1, signer),
      address,
      input,
    };
  };

  const depositFromFxs = async (minAmountOut: bigint) => {
    const x = await depositFactory(FxsAddress);
    const ps = [minAmountOut, x.address] as const;
    const estimate = await x.zaps.estimateGas.depositFromUnderlyingAssets(
      [x.input, 0],
      ...ps
    );

    const tx = await x.zaps.depositFromUnderlyingAssets([x.input, 0], ...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const depositFromCvxFxs = async (minAmountOut: bigint) => {
    const x = await depositFactory(CvxFxsAddress);
    const ps = [minAmountOut, x.address] as const;

    const estimate = await x.zaps.estimateGas.depositFromUnderlyingAssets(
      [0, x.input],
      ...ps
    );

    const tx = await x.zaps.depositFromUnderlyingAssets([0, x.input], ...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const depositFromLp = async () => {
    const x = await depositFactory(CvxFxsFactoryERC20Address);
    const ps = [x.input, 0, 0, 0, x.address] as const;

    const estimate = await x.zaps.estimateGas.depositWithRewards(...ps);

    const tx = await x.zaps.depositWithRewards(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  // Zaps
  const fxs: ZapDeposit = {
    logo: logoFXS,
    label: "FXS",
    zap: (minAmountOut?: bigint) => depositFromFxs(minAmountOut ?? 0n),
    depositSymbol: "FXS",
    depositBalance: () => {
      const address = getAddress();
      const provider = getSigner()?.provider;

      if (!address || !provider) {
        throw new Error("Unable to construct deposit zap balance");
      }

      const depositERC20 = ERC20__factory.connect(FxsAddress, provider);
      return depositERC20.balanceOf(address).then((x) => x.toBigInt());
    },
    depositDecimals: () => {
      const provider = getSigner()?.provider;

      if (!provider) {
        throw new Error("Unable to construct deposit zap decimals");
      }

      const depositERC20 = ERC20__factory.connect(FxsAddress, provider);
      return depositERC20.decimals().then((x) => BigInt(x));
    },
    getMinAmountOut: async (
      host: string,
      signer: JsonRpcSigner,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const llamaService = new DefiLlamaService(host);

      const fxs = await llamaService
        .getPrice(FxsAddress)
        .then((x) => x.price)
        .catch(() => Infinity);

      const cvxfxslp = await getCvxFxsLpPrice(llamaService, signer.provider)
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
    getMinAmountOut: async (
      host: string,
      signer: JsonRpcSigner,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const llamaService = new DefiLlamaService(host);

      const curvePool = CurveV2FactoryPool__factory.connect(
        CvxFxsFactoryAddress,
        signer
      );

      const cvxfxs = await getCvxFxsPrice(llamaService, curvePool)
        .then((x) => x)
        .catch(() => Infinity);

      const cvxfxslp = await getCvxFxsLpPrice(llamaService, signer.provider)
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
    depositBalance: () => {
      const address = getAddress();
      const provider = getSigner()?.provider;

      if (!address || !provider) {
        throw new Error("Unable to construct deposit zap balance");
      }

      const depositERC20 = ERC20__factory.connect(
        CvxFxsFactoryERC20Address,
        provider
      );
      return depositERC20.balanceOf(address).then((x) => x.toBigInt());
    },
    depositDecimals: () => {
      const provider = getSigner()?.provider;

      if (!provider) {
        throw new Error("Unable to construct deposit zap decimals");
      }

      const depositERC20 = ERC20__factory.connect(
        CvxFxsFactoryERC20Address,
        provider
      );
      return depositERC20.decimals().then((x) => BigInt(x));
    },
  };

  const options = [fxs, cvxFXS, cvxFXSLP];

  return options;
}
