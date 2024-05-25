import { type JsonRpcSigner } from "@ethersproject/providers";
import { maxApprove } from "@/Wallet";
import { getProvider } from "@/Wallet/ProviderFactory";
import {
  ERC20__factory,
  ZapsUFxsLp__factory,
  type UnionVault,
  UnionVault__factory,
  CurveV2FactoryPool__factory,
} from "@/Contracts";
import { DefiLlamaService } from "@/Services";
import { getCvxFxsLpPrice, getCvxFxsPrice } from "@/Util";
import {
  CvxAddress,
  CvxFxsFactoryAddress,
  FxsAddress,
  UnionFxsVaultAddressV1,
  WEthAddress,
  ZapsUFxsAddressV1,
} from "@/Util/Addresses";
import { type ZapWithdraw } from "@Pounders/Models/Zap";
import { calcMinAmountOut } from "@Pounders/Util/MinAmountOutHelper";

import logoCVX from "@/Assets/Icons/Tokens/cvx.svg";
import logoFXS from "@/Assets/Icons/Tokens/fxs.png";
import logoETH from "@/Assets/Icons/Tokens/eth.svg";
import logoUSDT from "@/Assets/Icons/Tokens/usdt.svg";
import logoUSDC from "@/Assets/Icons/Tokens/usdc.svg";

// eslint-disable-next-line max-lines-per-function
export function uFxsLpWithdrawZaps(
  getAddress: () => string | undefined,
  getInput: () => bigint | null,
  getVault: () => UnionVault | undefined
): ZapWithdraw[] {
  const withdrawFactory = async () => {
    const address = getAddress();
    const vault = getVault();
    const input = getInput();
    const provider = getProvider();

    if (!address || !vault || !input || !provider) {
      throw new Error("Unable to construct extra withdraw zaps");
    }

    const signer = provider.getSigner();

    const utkn = ERC20__factory.connect(UnionFxsVaultAddressV1, signer);
    await maxApprove(utkn, address, ZapsUFxsAddressV1, input);

    return {
      zaps: ZapsUFxsLp__factory.connect(ZapsUFxsAddressV1, signer),
      address,
      input,
      vault,
    };
  };

  const withdrawAsFxs = async (minAmountOut: bigint) => {
    const x = await withdrawFactory();
    const ps = [x.input, 0, minAmountOut, x.address] as const;

    const estimate = await x.zaps.estimateGas.claimFromVaultAsUnderlying(...ps);

    const tx = await x.zaps.claimFromVaultAsUnderlying(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const withdrawAsCvxFxs = async (minAmountOut: bigint) => {
    const x = await withdrawFactory();
    const ps = [x.input, 1, minAmountOut, x.address] as const;

    const estimate = await x.zaps.estimateGas.claimFromVaultAsUnderlying(...ps);

    const tx = await x.zaps.claimFromVaultAsUnderlying(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const withdrawAsLp = async () => {
    const address = getAddress();
    const vault = getVault();
    const input = getInput();
    const provider = getProvider();

    if (!address || !vault || !input || !provider) {
      throw new Error("Unable to construct extra withdraw zaps");
    }

    const signer = provider.getSigner();
    const utkn = UnionVault__factory.connect(UnionFxsVaultAddressV1, signer);

    const ps = [address, input] as const;
    const estimate = await utkn.estimateGas.withdraw(...ps);
    const tx = await utkn.withdraw(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const withdrawAsCvx = async (minAmountOut: bigint) => {
    const x = await withdrawFactory();
    const ps = [x.input, minAmountOut, x.address, false] as const;

    const estimate = await x.zaps.estimateGas.claimFromVaultAsCvx(...ps);

    const tx = await x.zaps.claimFromVaultAsCvx(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const withdrawAsCvxAndLock = async (minAmountOut: bigint) => {
    const x = await withdrawFactory();
    const ps = [x.input, minAmountOut, x.address, true] as const;

    const estimate = await x.zaps.estimateGas.claimFromVaultAsCvx(...ps);

    const tx = await x.zaps.claimFromVaultAsCvx(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const withdrawAsEth = async (minAmountOut: bigint) => {
    const x = await withdrawFactory();
    const ps = [x.input, minAmountOut, x.address] as const;

    const estimate = await x.zaps.estimateGas.claimFromVaultAsEth(...ps);

    const tx = await x.zaps.claimFromVaultAsEth(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const withdrawAsUsdt = async (minAmountOut: bigint) => {
    const x = await withdrawFactory();
    const ps = [x.input, minAmountOut, x.address] as const;

    const estimate = await x.zaps.estimateGas.claimFromVaultAsUsdt(...ps);

    const tx = await x.zaps.claimFromVaultAsUsdt(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const withdrawAsUsdc = async (minAmountOut: bigint) => {
    const x = await withdrawFactory();
    const ps = [
      x.input,
      minAmountOut,
      "0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f",
      "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      x.address,
    ] as const;

    const estimate = await x.zaps.estimateGas.claimFromVaultViaUniV2EthPair(
      ...ps
    );

    const tx = await x.zaps.claimFromVaultViaUniV2EthPair(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
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

  const cvx: ZapWithdraw = {
    logo: logoCVX,
    label: "CVX",
    withdrawSymbol: "CVX",
    withdrawDecimals: () => Promise.resolve(18n),
    zap: (minAmountOut?: bigint) => withdrawAsCvx(minAmountOut ?? 0n),
    getMinAmountOut: async (
      host: string,
      signer: JsonRpcSigner,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const llamaService = new DefiLlamaService(host);

      const cvx = await llamaService
        .getPrice(CvxAddress)
        .then((x) => x.price)
        .catch(() => Infinity);

      const cvxfxslp = await getCvxFxsLpPrice(llamaService, signer.provider)
        .then((x) => x)
        .catch(() => Infinity);

      return calcMinAmountOut(input, cvxfxslp, cvx, slippage);
    },
  };

  const cvxAndLock: ZapWithdraw = {
    logo: logoCVX,
    label: "CVX & Lock",
    withdrawSymbol: "CVX",
    withdrawDecimals: () => Promise.resolve(18n),
    zap: (minAmountOut?: bigint) => withdrawAsCvxAndLock(minAmountOut ?? 0n),
    getMinAmountOut: async (
      host: string,
      signer: JsonRpcSigner,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const llamaService = new DefiLlamaService(host);

      const cvx = await llamaService
        .getPrice(CvxAddress)
        .then((x) => x.price)
        .catch(() => Infinity);

      const cvxfxslp = await getCvxFxsLpPrice(llamaService, signer.provider)
        .then((x) => x)
        .catch(() => Infinity);

      return calcMinAmountOut(input, cvxfxslp, cvx, slippage);
    },
  };

  const eth: ZapWithdraw = {
    logo: logoETH,
    label: "ETH",
    withdrawSymbol: "ETH",
    withdrawDecimals: () => Promise.resolve(18n),
    zap: (minAmountOut?: bigint) => withdrawAsEth(minAmountOut ?? 0n),
    getMinAmountOut: async (
      host: string,
      signer: JsonRpcSigner,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const llamaService = new DefiLlamaService(host);

      const weth = await llamaService
        .getPrice(WEthAddress)
        .then((x) => x.price)
        .catch(() => Infinity);

      const cvxfxslp = await getCvxFxsLpPrice(llamaService, signer.provider)
        .then((x) => x)
        .catch(() => Infinity);

      return calcMinAmountOut(input, cvxfxslp, weth, slippage);
    },
  };

  const usdt: ZapWithdraw = {
    logo: logoUSDT,
    label: "USDT",
    withdrawSymbol: "USDT",
    withdrawDecimals: () => Promise.resolve(6n),
    zap: (minAmountOut?: bigint) => withdrawAsUsdt(minAmountOut ?? 0n),
    getMinAmountOut: async (
      host: string,
      signer: JsonRpcSigner,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const llamaService = new DefiLlamaService(host);

      const cvxfxslp = await getCvxFxsLpPrice(llamaService, signer.provider)
        .then((x) => x)
        .catch(() => Infinity);

      return calcMinAmountOut(input, cvxfxslp, 1, slippage);
    },
  };

  const usdc: ZapWithdraw = {
    logo: logoUSDC,
    label: "USDC",
    withdrawSymbol: "USDC",
    withdrawDecimals: () => Promise.resolve(6n),
    zap: (minAmountOut?: bigint) => withdrawAsUsdc(minAmountOut ?? 0n),
    getMinAmountOut: async (
      host: string,
      signer: JsonRpcSigner,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const llamaService = new DefiLlamaService(host);

      const cvxfxslp = await getCvxFxsLpPrice(llamaService, signer.provider)
        .then((x) => x)
        .catch(() => Infinity);

      return calcMinAmountOut(input, cvxfxslp, 1, slippage);
    },
  };

  const options = [fxs, cvxFXS, cvxFXSLP, cvx, cvxAndLock, eth, usdt, usdc];

  return options;
}
