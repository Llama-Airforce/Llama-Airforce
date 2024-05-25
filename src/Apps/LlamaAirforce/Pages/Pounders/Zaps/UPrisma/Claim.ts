import { type JsonRpcSigner } from "@ethersproject/providers";
import { maxApprove } from "@/Wallet";
import { getProvider } from "@/Wallet/ProviderFactory";
import { ERC20__factory, ZapsUPrismaClaim__factory } from "@/Contracts";
import { DefiLlamaService } from "@/Services";
import {
  PrismaAddress,
  UnionPrismaVaultAddress,
  WEthAddress,
  ZapsUPrismaClaimAddress,
} from "@/Util/Addresses";
import { type Airdrop } from "@Pounders/Models/Airdrop";
import { type ZapClaim } from "@Pounders/Models/Zap";
import { calcMinAmountOut } from "@Pounders/Util/MinAmountOutHelper";
import { getUPrismaPrice } from "@Pounders/Zaps/UPrisma/PriceHelper";

import logoAirforce from "@/Assets/Icons/Tokens/airforce.png";
import logoETH from "@/Assets/Icons/Tokens/eth.svg";
import logoPRISMA from "@/Assets/Icons/Tokens/prisma.svg";
import logoUSDT from "@/Assets/Icons/Tokens/usdt.svg";
import logoUSDC from "@/Assets/Icons/Tokens/usdc.svg";

// eslint-disable-next-line max-lines-per-function
export function uPrismaClaimZaps(
  getAddress: () => string | undefined,
  getAirdrop: () => Airdrop | null
): ZapClaim[] {
  const extraZapFactory = async () => {
    const address = getAddress();
    const airdrop = getAirdrop();
    const provider = getProvider();

    if (!address || !airdrop || !provider) {
      throw new Error("Unable to construct extra claim zaps");
    }

    const signer = provider.getSigner();

    const utkn = ERC20__factory.connect(UnionPrismaVaultAddress, signer);
    await maxApprove(utkn, address, ZapsUPrismaClaimAddress, airdrop.amount);

    return {
      extraZaps: ZapsUPrismaClaim__factory.connect(
        ZapsUPrismaClaimAddress,
        signer
      ),
      address,
      amount: airdrop.amount,
      claim: airdrop.claim,
    };
  };

  const claim = async () => {
    const address = getAddress();
    const airdrop = getAirdrop();

    if (!airdrop || !address) {
      return;
    }

    const distributor = airdrop.distributor();
    const ps = [
      airdrop.claim.index,
      address,
      airdrop.amount,
      airdrop.claim.proof,
    ] as const;

    const estimate = await distributor.estimateGas.claim(...ps);

    const tx = await distributor.claim(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const claimAsPrisma = async (minAmountOut: bigint) => {
    const x = await extraZapFactory();
    const ps = [
      x.claim.index,
      x.address,
      x.amount,
      x.claim.proof,
      minAmountOut,
      x.address,
    ] as const;

    const estimate = await x.extraZaps.estimateGas.claimFromDistributorAsPrisma(
      ...ps
    );

    const tx = await x.extraZaps.claimFromDistributorAsPrisma(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const claimAsCvxPrisma = async () => {
    const x = await extraZapFactory();
    const ps = [
      x.claim.index,
      x.address,
      x.amount,
      x.claim.proof,
      x.address,
    ] as const;

    const estimate =
      await x.extraZaps.estimateGas.claimFromDistributorAsUnderlying(...ps);

    const tx = await x.extraZaps.claimFromDistributorAsUnderlying(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const claimAsEth = async (minAmountOut: bigint) => {
    const x = await extraZapFactory();
    const ps = [
      x.claim.index,
      x.address,
      x.amount,
      x.claim.proof,
      minAmountOut,
      x.address,
    ] as const;

    const estimate = await x.extraZaps.estimateGas.claimFromDistributorAsEth(
      ...ps
    );

    const tx = await x.extraZaps.claimFromDistributorAsEth(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const claimAsUsdt = async (minAmountOut: bigint) => {
    const x = await extraZapFactory();
    const ps = [
      x.claim.index,
      x.address,
      x.amount,
      x.claim.proof,
      minAmountOut,
      x.address,
    ] as const;

    const estimate = await x.extraZaps.estimateGas.claimFromDistributorAsUsdt(
      ...ps
    );

    const tx = await x.extraZaps.claimFromDistributorAsUsdt(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const claimAsUsdc = async (minAmountOut: bigint) => {
    const x = await extraZapFactory();
    const ps = [
      x.claim.index,
      x.address,
      x.amount,
      x.claim.proof,
      minAmountOut,
      "0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f",
      "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      x.address,
    ] as const;

    const estimate =
      await x.extraZaps.estimateGas.claimFromDistributorViaUniV2EthPair(...ps);

    const tx = await x.extraZaps.claimFromDistributorViaUniV2EthPair(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  // Zaps
  const uprisma: ZapClaim = {
    logo: logoAirforce,
    label: "uPRISMA",
    withdrawSymbol: "uPRISMA",
    withdrawDecimals: () => Promise.resolve(18n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: () => claim(),
  };

  const prisma: ZapClaim = {
    logo: logoPRISMA,
    label: "PRISMA",
    withdrawSymbol: "PRISMA",
    withdrawDecimals: () => Promise.resolve(18n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: (minAmountOut?: bigint) => claimAsPrisma(minAmountOut ?? 0n),
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

  const cvxPRISMA: ZapClaim = {
    logo: logoPRISMA,
    label: "cvxPRISMA",
    withdrawSymbol: "cvxPRISMA",
    withdrawDecimals: () => Promise.resolve(18n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: () => claimAsCvxPrisma(),
  };

  const eth: ZapClaim = {
    logo: logoETH,
    label: "ETH",
    withdrawSymbol: "ETH",
    withdrawDecimals: () => Promise.resolve(18n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: (minAmountOut?: bigint) => claimAsEth(minAmountOut ?? 0n),
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

  const usdt: ZapClaim = {
    logo: logoUSDT,
    label: "USDT",
    withdrawSymbol: "USDT",
    withdrawDecimals: () => Promise.resolve(6n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: (minAmountOut?: bigint) => claimAsUsdt(minAmountOut ?? 0n),
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

  const usdc: ZapClaim = {
    logo: logoUSDC,
    label: "USDC",
    withdrawSymbol: "USDC",
    withdrawDecimals: () => Promise.resolve(6n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: (minAmountOut?: bigint) => claimAsUsdc(minAmountOut ?? 0n),
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

  const options = [uprisma, prisma, cvxPRISMA, eth, usdt, usdc];

  return options;
}
