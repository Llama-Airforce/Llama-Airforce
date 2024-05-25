import { type JsonRpcSigner } from "@ethersproject/providers";
import { maxApprove } from "@/Wallet";
import { getProvider } from "@/Wallet/ProviderFactory";
import {
  CurveV2FactoryPool__factory,
  ERC20__factory,
  ZapsUFxsClaim__factory,
} from "@/Contracts";
import { DefiLlamaService } from "@/Services";
import { getCvxFxsPrice } from "@/Util";
import {
  CvxAddress,
  CvxFxsFactoryAddress,
  FxsAddress,
  UnionFxsVaultAddress,
  WEthAddress,
  ZapsUFxsClaimAddress,
} from "@/Util/Addresses";
import { type Airdrop } from "@Pounders/Models/Airdrop";
import { type ZapClaim } from "@Pounders/Models/Zap";
import { calcMinAmountOut } from "@Pounders/Util/MinAmountOutHelper";
import { getUFxsPrice } from "@Pounders/Zaps/UFxs/PriceHelper";

import logoAirforce from "@/Assets/Icons/Tokens/airforce.png";
import logoCVX from "@/Assets/Icons/Tokens/cvx.svg";
import logoFXS from "@/Assets/Icons/Tokens/fxs.png";
import logoETH from "@/Assets/Icons/Tokens/eth.svg";
import logoUSDT from "@/Assets/Icons/Tokens/usdt.svg";
import logoUSDC from "@/Assets/Icons/Tokens/usdc.svg";

// eslint-disable-next-line max-lines-per-function
export function uFxsClaimZaps(
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

    const utkn = ERC20__factory.connect(UnionFxsVaultAddress, signer);
    await maxApprove(utkn, address, ZapsUFxsClaimAddress, airdrop.amount);

    return {
      extraZaps: ZapsUFxsClaim__factory.connect(ZapsUFxsClaimAddress, signer),
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

  const claimAsFxs = async (minAmountOut: bigint) => {
    const x = await extraZapFactory();
    const ps = [
      x.claim.index,
      x.address,
      x.amount,
      x.claim.proof,
      minAmountOut,
      x.address,
    ] as const;

    const estimate = await x.extraZaps.estimateGas.claimFromDistributorAsFxs(
      ...ps
    );

    const tx = await x.extraZaps.claimFromDistributorAsFxs(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const claimAsCvxFxs = async (minAmountOut: bigint) => {
    const x = await extraZapFactory();
    const ps = [
      x.claim.index,
      x.address,
      x.amount,
      x.claim.proof,
      minAmountOut,
      x.address,
    ] as const;

    const estimate =
      await x.extraZaps.estimateGas.claimFromDistributorAsUnderlying(...ps);

    const tx = await x.extraZaps.claimFromDistributorAsUnderlying(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const claimAsCvx = async (minAmountOut: bigint) => {
    const x = await extraZapFactory();
    const ps = [
      x.claim.index,
      x.address,
      x.amount,
      x.claim.proof,
      minAmountOut,
      x.address,
      false,
    ] as const;

    const estimate = await x.extraZaps.estimateGas.claimFromDistributorAsCvx(
      ...ps
    );

    const tx = await x.extraZaps.claimFromDistributorAsCvx(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const claimAsCvxAndLock = async (minAmountOut: bigint) => {
    const x = await extraZapFactory();
    const ps = [
      x.claim.index,
      x.address,
      x.amount,
      x.claim.proof,
      minAmountOut,
      x.address,
      true,
    ] as const;

    const estimate = await x.extraZaps.estimateGas.claimFromDistributorAsCvx(
      ...ps
    );

    const tx = await x.extraZaps.claimFromDistributorAsCvx(...ps, {
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
  const ufxs: ZapClaim = {
    logo: logoAirforce,
    label: "uFXS",
    withdrawSymbol: "uFXS",
    withdrawDecimals: () => Promise.resolve(18n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: () => claim(),
  };

  const fxs: ZapClaim = {
    logo: logoFXS,
    label: "FXS",
    withdrawSymbol: "FXS",
    withdrawDecimals: () => Promise.resolve(18n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: (minAmountOut?: bigint) => claimAsFxs(minAmountOut ?? 0n),
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

  const cvxFXS: ZapClaim = {
    logo: logoFXS,
    label: "cvxFXS",
    withdrawSymbol: "cvxFXS",
    withdrawDecimals: () => Promise.resolve(18n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: (minAmountOut?: bigint) => claimAsCvxFxs(minAmountOut ?? 0n),
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

      const ufxs = await getUFxsPrice(llamaService, signer);

      return calcMinAmountOut(input, ufxs, cvxfxs, slippage);
    },
  };

  const cvx: ZapClaim = {
    logo: logoCVX,
    label: "CVX",
    withdrawSymbol: "CVX",
    withdrawDecimals: () => Promise.resolve(18n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: (minAmountOut?: bigint) => claimAsCvx(minAmountOut ?? 0n),
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

  const cvxAndLock: ZapClaim = {
    logo: logoCVX,
    label: "CVX & Lock",
    withdrawSymbol: "CVX",
    withdrawDecimals: () => Promise.resolve(18n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: (minAmountOut?: bigint) => claimAsCvxAndLock(minAmountOut ?? 0n),
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

      const ufxs = await getUFxsPrice(llamaService, signer);

      return calcMinAmountOut(input, ufxs, weth, slippage);
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

      const ufxs = await getUFxsPrice(llamaService, signer);

      return calcMinAmountOut(input, ufxs, 1, slippage);
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

      const ufxs = await getUFxsPrice(llamaService, signer);

      return calcMinAmountOut(input, ufxs, 1, slippage);
    },
  };

  const options = [ufxs, fxs, cvxFXS, cvx, cvxAndLock, eth, usdt, usdc];

  return options;
}
