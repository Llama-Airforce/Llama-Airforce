import { type JsonRpcSigner } from "@ethersproject/providers";
import { maxApprove } from "@/Wallet";
import { getProvider } from "@/Wallet/ProviderFactory";
import {
  ERC20__factory,
  ZapsUPrisma__factory,
  type UnionVault,
  UnionVault__factory,
} from "@/Contracts";
import { DefiLlamaService } from "@/Services";
import {
  PrismaAddress,
  UnionPrismaVaultAddress,
  WEthAddress,
  ZapsUPrismaAddress,
} from "@/Util/Addresses";
import { type ZapWithdraw } from "@Pounders/Models/Zap";
import { calcMinAmountOut } from "@Pounders/Util/MinAmountOutHelper";
import { getUPrismaPrice } from "@Pounders/Zaps/UPrisma/PriceHelper";

import logoETH from "@/Assets/Icons/Tokens/eth.svg";
import logoPRISMA from "@/Assets/Icons/Tokens/prisma.svg";
import logoUSDT from "@/Assets/Icons/Tokens/usdt.svg";
import logoUSDC from "@/Assets/Icons/Tokens/usdc.svg";

// eslint-disable-next-line max-lines-per-function
export function uPrismaWithdrawZaps(
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
    const utkn = UnionVault__factory.connect(UnionPrismaVaultAddress, signer);

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

    const utkn = ERC20__factory.connect(UnionPrismaVaultAddress, signer);
    await maxApprove(utkn, address, ZapsUPrismaAddress, input);

    return {
      zaps: ZapsUPrisma__factory.connect(ZapsUPrismaAddress, signer),
      address,
      input,
      vault,
    };
  };

  const withdrawAsPrisma = async (minAmountOut: bigint) => {
    const x = await withdrawFactory();
    const ps = [x.input, minAmountOut, x.address] as const;
    const estimate = await x.zaps.estimateGas.claimFromVaultAsPrisma(...ps);

    const tx = await x.zaps.claimFromVaultAsPrisma(...ps, {
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
  const cvxPRISMA: ZapWithdraw = {
    logo: logoPRISMA,
    label: "cvxPRISMA",
    withdrawSymbol: "cvxPRISMA",
    withdrawDecimals: () => Promise.resolve(18n),
    zap: () => withdraw(),
  };

  const prisma: ZapWithdraw = {
    logo: logoPRISMA,
    label: "PRISMA",
    withdrawSymbol: "PRISMA",
    withdrawDecimals: () => Promise.resolve(18n),
    zap: (minAmountOut?: bigint) => withdrawAsPrisma(minAmountOut ?? 0n),
    getMinAmountOut: async (
      host: string,
      signer: JsonRpcSigner,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const llamaService = new DefiLlamaService(host);

      const prisma = await llamaService
        .getPrice(PrismaAddress)
        .then((x) => x.price)
        .catch(() => Infinity);

      const uprisma = await getUPrismaPrice(llamaService, signer);

      return calcMinAmountOut(input, uprisma, prisma, slippage);
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

      const uprisma = await getUPrismaPrice(llamaService, signer);

      return calcMinAmountOut(input, uprisma, weth, slippage);
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

      const uprisma = await getUPrismaPrice(llamaService, signer);

      return calcMinAmountOut(input, uprisma, 1, slippage);
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

      const uprisma = await getUPrismaPrice(llamaService, signer);

      return calcMinAmountOut(input, uprisma, 1, slippage);
    },
  };

  const options = [cvxPRISMA, prisma, eth, usdt, usdc];

  return options;
}
