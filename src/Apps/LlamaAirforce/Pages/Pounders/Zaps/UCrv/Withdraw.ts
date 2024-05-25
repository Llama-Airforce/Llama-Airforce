import { type JsonRpcSigner } from "@ethersproject/providers";
import { maxApprove } from "@/Wallet";
import { getProvider } from "@/Wallet/ProviderFactory";
import {
  ERC20__factory,
  ZapsUCrv__factory,
  type UnionVault,
} from "@/Contracts";
import { DefiLlamaService } from "@/Services";
import {
  UnionCrvVaultAddress,
  ZapsUCrvAddress,
  WEthAddress,
  CvxAddress,
  CrvAddress,
} from "@/Util/Addresses";
import { type ZapWithdraw } from "@Pounders/Models/Zap";
import { calcMinAmountOut } from "@Pounders/Util/MinAmountOutHelper";
import { getUCrvPrice } from "@Pounders/Zaps/UCrv/PriceHelper";

import logoCRV from "@/Assets/Icons/Tokens/crv.svg";
import logoCVX from "@/Assets/Icons/Tokens/cvx.svg";
import logoETH from "@/Assets/Icons/Tokens/eth.svg";
import logoUSDT from "@/Assets/Icons/Tokens/usdt.svg";
import logoUSDC from "@/Assets/Icons/Tokens/usdc.svg";

// eslint-disable-next-line max-lines-per-function
export function uCrvWithdrawZaps(
  getAddress: () => string | undefined,
  getInput: () => bigint | null,
  getVault: () => UnionVault | undefined
): ZapWithdraw[] {
  const withdraw = async () => {
    const address = getAddress();
    const vault = getVault();
    const input = getInput();

    if (!address || !vault || !input) {
      throw new Error("Unable to construct withdraw zaps");
    }

    const ps = [address, input] as const;

    const estimate = await vault.estimateGas.withdraw(...ps);

    const tx = await vault.withdraw(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const extraZapFactory = async (zapAddress: string) => {
    const address = getAddress();
    const vault = getVault();
    const input = getInput();
    const provider = getProvider();

    if (!address || !vault || !input || !provider) {
      throw new Error("Unable to construct extra withdraw zaps");
    }

    const signer = provider.getSigner();

    const utkn = ERC20__factory.connect(UnionCrvVaultAddress, signer);
    await maxApprove(utkn, address, zapAddress, input);

    return {
      extraZaps: ZapsUCrv__factory.connect(zapAddress, signer),
      address,
      input,
      vault,
    };
  };

  const withdrawAsCrv = async (minAmountOut: bigint) => {
    const x = await extraZapFactory(ZapsUCrvAddress);
    const ps = [x.input, minAmountOut, x.address] as const;

    const estimate = await x.extraZaps.estimateGas.claimFromVaultAsCrv(...ps);

    const tx = await x.extraZaps.claimFromVaultAsCrv(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const withdrawAsCvx = async (minAmountOut: bigint) => {
    const x = await extraZapFactory(ZapsUCrvAddress);
    const ps = [x.input, minAmountOut, x.address, false] as const;

    const estimate = await x.extraZaps.estimateGas.claimFromVaultAsCvx(...ps);

    const tx = await x.extraZaps.claimFromVaultAsCvx(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const withdrawAsCvxAndLock = async (minAmountOut: bigint) => {
    const x = await extraZapFactory(ZapsUCrvAddress);
    const ps = [x.input, minAmountOut, x.address, true] as const;

    const estimate = await x.extraZaps.estimateGas.claimFromVaultAsCvx(...ps);

    const tx = await x.extraZaps.claimFromVaultAsCvx(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const withdrawAsEth = async (minAmountOut: bigint) => {
    const x = await extraZapFactory(ZapsUCrvAddress);
    const ps = [x.input, minAmountOut, x.address] as const;

    const estimate = await x.extraZaps.estimateGas.claimFromVaultAsEth(...ps);

    const tx = await x.extraZaps.claimFromVaultAsEth(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const withdrawAs3PoolAndStake = async (minAmountOut: bigint) => {
    const x = await extraZapFactory(ZapsUCrvAddress);
    const ps = [x.input, minAmountOut, x.address] as const;

    const estimate =
      await x.extraZaps.estimateGas.claimFromVaultAndStakeIn3PoolConvex(...ps);

    const tx = await x.extraZaps.claimFromVaultAndStakeIn3PoolConvex(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const withdrawAsUsdt = async (minAmountOut: bigint) => {
    const x = await extraZapFactory(ZapsUCrvAddress);
    const ps = [x.input, minAmountOut, x.address] as const;

    const estimate = await x.extraZaps.estimateGas.claimFromVaultAsUsdt(...ps);

    const tx = await x.extraZaps.claimFromVaultAsUsdt(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const withdrawAsUsdc = async (minAmountOut: bigint) => {
    const x = await extraZapFactory(ZapsUCrvAddress);
    const ps = [
      x.input,
      minAmountOut,
      "0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f",
      "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      x.address,
    ] as const;

    const estimate =
      await x.extraZaps.estimateGas.claimFromVaultViaUniV2EthPair(...ps);

    const tx = await x.extraZaps.claimFromVaultViaUniV2EthPair(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  // Zaps
  const cvxCRV: ZapWithdraw = {
    logo: logoCRV,
    label: "cvxCRV",
    withdrawSymbol: "cvxCRV",
    withdrawDecimals: () => Promise.resolve(18n),
    zap: () => withdraw(),
  };

  const crv: ZapWithdraw = {
    logo: logoCRV,
    label: "CRV",
    withdrawSymbol: "CRV",
    withdrawDecimals: () => Promise.resolve(18n),
    zap: (minAmountOut?: bigint) => withdrawAsCrv(minAmountOut ?? 0n),
    getMinAmountOut: async (
      host: string,
      signer: JsonRpcSigner,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const llamaService = new DefiLlamaService(host);

      const crv = await llamaService
        .getPrice(CrvAddress)
        .then((x) => x.price)
        .catch(() => Infinity);

      const ucrv = await getUCrvPrice(llamaService, signer);

      return calcMinAmountOut(input, ucrv, crv, slippage);
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

      const ucrv = await getUCrvPrice(llamaService, signer);

      return calcMinAmountOut(input, ucrv, cvx, slippage);
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

      const ucrv = await getUCrvPrice(llamaService, signer);

      return calcMinAmountOut(input, ucrv, cvx, slippage);
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

      const ucrv = await getUCrvPrice(llamaService, signer);

      return calcMinAmountOut(input, ucrv, weth, slippage);
    },
  };

  const threeCrvAndStake: ZapWithdraw = {
    logo: logoCRV,
    label: "3CRV & Stake (Convex)",
    withdrawSymbol: "3CRV",
    withdrawDecimals: () => Promise.resolve(18n),
    zap: (minAmountOut?: bigint) => withdrawAs3PoolAndStake(minAmountOut ?? 0n),
    getMinAmountOut: async (
      host: string,
      signer: JsonRpcSigner,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const llamaService = new DefiLlamaService(host);

      const ucrv = await getUCrvPrice(llamaService, signer);

      return calcMinAmountOut(input, ucrv, 1, slippage);
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

      const ucrv = await getUCrvPrice(llamaService, signer);

      return calcMinAmountOut(input, ucrv, 1, slippage);
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

      const ucrv = await getUCrvPrice(llamaService, signer);

      return calcMinAmountOut(input, ucrv, 1, slippage);
    },
  };

  const options = [
    cvxCRV,
    crv,
    cvx,
    cvxAndLock,
    eth,
    threeCrvAndStake,
    usdt,
    usdc,
  ];

  return options;
}
