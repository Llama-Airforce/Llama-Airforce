import { type JsonRpcSigner } from "@ethersproject/providers";
import { maxApprove } from "@/Wallet";
import { getProvider } from "@/Wallet/ProviderFactory";
import {
  ERC20__factory,
  ZapsUFxs__factory,
  type UnionVault,
  UnionVault__factory,
} from "@/Contracts";
import { DefiLlamaService } from "@/Services";
import {
  CvxAddress,
  FxsAddress,
  UnionFxsVaultAddress,
  WEthAddress,
  ZapsUFxsAddress,
} from "@/Util/Addresses";
import { type ZapWithdraw } from "@Pounders/Models/Zap";
import { calcMinAmountOut } from "@Pounders/Util/MinAmountOutHelper";
import { getUFxsPrice } from "@Pounders/Zaps/UFxs/PriceHelper";

import logoCVX from "@/Assets/Icons/Tokens/cvx.svg";
import logoFXS from "@/Assets/Icons/Tokens/fxs.png";
import logoETH from "@/Assets/Icons/Tokens/eth.svg";
import logoUSDT from "@/Assets/Icons/Tokens/usdt.svg";
import logoUSDC from "@/Assets/Icons/Tokens/usdc.svg";

// eslint-disable-next-line max-lines-per-function
export function uFxsWithdrawZaps(
  getAddress: () => string | undefined,
  getInput: () => bigint | null,
  getVault: () => UnionVault | undefined
): ZapWithdraw[] {
  const withdraw = async () => {
    const address = getAddress();
    const vault = getVault();
    const input = getInput();
    const provider = getProvider();

    if (!address || !vault || !input || !provider) {
      throw new Error("Unable to construct extra withdraw zaps");
    }

    const signer = provider.getSigner();
    const utkn = UnionVault__factory.connect(UnionFxsVaultAddress, signer);

    const ps = [address, input] as const;
    const estimate = await utkn.estimateGas.withdraw(...ps);
    const tx = await utkn.withdraw(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const withdrawFactory = async () => {
    const address = getAddress();
    const vault = getVault();
    const input = getInput();
    const provider = getProvider();

    if (!address || !vault || !input || !provider) {
      throw new Error("Unable to construct extra withdraw zaps");
    }

    const signer = provider.getSigner();

    const utkn = ERC20__factory.connect(UnionFxsVaultAddress, signer);
    await maxApprove(utkn, address, ZapsUFxsAddress, input);

    return {
      zaps: ZapsUFxs__factory.connect(ZapsUFxsAddress, signer),
      address,
      input,
      vault,
    };
  };

  const withdrawAsFxs = async (minAmountOut: bigint) => {
    const x = await withdrawFactory();
    const ps = [x.input, minAmountOut, x.address] as const;
    const estimate = await x.zaps.estimateGas.claimFromVaultAsFxs(...ps);

    const tx = await x.zaps.claimFromVaultAsFxs(...ps, {
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
  const cvxFXS: ZapWithdraw = {
    logo: logoFXS,
    label: "cvxFXS",
    withdrawSymbol: "cvxFXS",
    withdrawDecimals: () => Promise.resolve(18n),
    zap: () => withdraw(),
  };

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

      const ufxs = await getUFxsPrice(llamaService, signer);

      return calcMinAmountOut(input, ufxs, fxs, slippage);
    },
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

      const ufxs = await getUFxsPrice(llamaService, signer);

      return calcMinAmountOut(input, ufxs, cvx, slippage);
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

      const ufxs = await getUFxsPrice(llamaService, signer);

      return calcMinAmountOut(input, ufxs, cvx, slippage);
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

      const ufxs = await getUFxsPrice(llamaService, signer);

      return calcMinAmountOut(input, ufxs, weth, slippage);
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

      const ufxs = await getUFxsPrice(llamaService, signer);

      return calcMinAmountOut(input, ufxs, 1, slippage);
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

      const ufxs = await getUFxsPrice(llamaService, signer);

      return calcMinAmountOut(input, ufxs, 1, slippage);
    },
  };

  const options = [cvxFXS, fxs, cvx, cvxAndLock, eth, usdt, usdc];

  return options;
}
