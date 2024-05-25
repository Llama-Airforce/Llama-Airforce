import { type JsonRpcSigner } from "@ethersproject/providers";
import { maxApprove } from "@/Wallet";
import { getProvider } from "@/Wallet/ProviderFactory";
import { DefiLlamaService } from "@/Services";
import { ERC20__factory, ZapsUCrvClaim__factory } from "@/Contracts";
import {
  UnionCrvVaultAddress,
  ZapsUCrvClaimAddress,
  CrvAddress,
  CvxAddress,
  WEthAddress,
} from "@/Util/Addresses";
import { type Airdrop } from "@Pounders/Models/Airdrop";
import { type ZapClaim } from "@Pounders/Models/Zap";
import { calcMinAmountOut } from "@Pounders/Util/MinAmountOutHelper";
import { getUCrvPrice } from "@Pounders/Zaps/UCrv/PriceHelper";

import logoAirforce from "@/Assets/Icons/Tokens/airforce.png";
import logoCRV from "@/Assets/Icons/Tokens/crv.svg";
import logoCVX from "@/Assets/Icons/Tokens/cvx.svg";
import logoETH from "@/Assets/Icons/Tokens/eth.svg";
import logoUSDT from "@/Assets/Icons/Tokens/usdt.svg";
import logoUSDC from "@/Assets/Icons/Tokens/usdc.svg";

// eslint-disable-next-line max-lines-per-function
export function uCrvClaimZaps(
  getAddress: () => string | undefined,
  getAirdrop: () => Airdrop | null
): ZapClaim[] {
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

  const extraZapFactory = async (zapAddress: string) => {
    const address = getAddress();
    const airdrop = getAirdrop();
    const provider = getProvider();

    if (!address || !airdrop || !provider) {
      throw new Error("Unable to construct extra claim zaps");
    }

    const signer = provider.getSigner();

    const utkn = ERC20__factory.connect(UnionCrvVaultAddress, signer);
    await maxApprove(utkn, address, zapAddress, airdrop.amount);

    return {
      extraZaps: ZapsUCrvClaim__factory.connect(zapAddress, signer),
      address,
      amount: airdrop.amount,
      claim: airdrop.claim,
    };
  };

  const claimAsCvxCrv = async () => {
    const x = await extraZapFactory(ZapsUCrvClaimAddress);
    const ps = [
      x.claim.index,
      x.address,
      x.amount,
      x.claim.proof,
      x.address,
    ] as const;

    const estimate = await x.extraZaps.estimateGas[
      "claimFromDistributorAsUnderlying(uint256,address,uint256,bytes32[],address)"
    ](...ps);

    const tx = await x.extraZaps[
      "claimFromDistributorAsUnderlying(uint256,address,uint256,bytes32[],address)"
    ](...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const claimAsCrv = async (minAmountOut: bigint) => {
    const x = await extraZapFactory(ZapsUCrvClaimAddress);
    const ps = [
      x.claim.index,
      x.address,
      x.amount,
      x.claim.proof,
      minAmountOut,
      x.address,
    ] as const;

    const estimate = await x.extraZaps.estimateGas.claimFromDistributorAsCrv(
      ...ps
    );

    const tx = await x.extraZaps.claimFromDistributorAsCrv(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const claimAsCvx = async (minAmountOut: bigint) => {
    const x = await extraZapFactory(ZapsUCrvClaimAddress);
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
    const x = await extraZapFactory(ZapsUCrvClaimAddress);
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
    const x = await extraZapFactory(ZapsUCrvClaimAddress);
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

  const claimAs3PoolAndStake = async (minAmountOut: bigint) => {
    const x = await extraZapFactory(ZapsUCrvClaimAddress);
    const ps = [
      x.claim.index,
      x.address,
      x.amount,
      x.claim.proof,
      minAmountOut,
      x.address,
    ] as const;

    const estimate =
      await x.extraZaps.estimateGas.claimFromDistributorAndStakeIn3PoolConvex(
        ...ps
      );

    const tx = await x.extraZaps.claimFromDistributorAndStakeIn3PoolConvex(
      ...ps,
      {
        gasLimit: estimate.mul(125).div(100),
      }
    );

    return tx.wait();
  };

  const claimAsUsdt = async (minAmountOut: bigint) => {
    const x = await extraZapFactory(ZapsUCrvClaimAddress);
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
    const x = await extraZapFactory(ZapsUCrvClaimAddress);
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
  const ucrv: ZapClaim = {
    logo: logoAirforce,
    label: "uCRV",
    withdrawSymbol: "uCRV",
    withdrawDecimals: () => Promise.resolve(18n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: () => claim(),
  };

  const cvxcrv: ZapClaim = {
    logo: logoCRV,
    label: "cvxCRV",
    withdrawSymbol: "cvxCRV",
    withdrawDecimals: () => Promise.resolve(18n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: () => claimAsCvxCrv(),
  };

  const crv: ZapClaim = {
    logo: logoCRV,
    label: "CRV",
    withdrawSymbol: "CRV",
    withdrawDecimals: () => Promise.resolve(18n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: (minAmountOut?: bigint) => claimAsCrv(minAmountOut ?? 0n),
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

      const ucrv = await getUCrvPrice(llamaService, signer);

      return calcMinAmountOut(input, ucrv, cvx, slippage);
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

      const ucrv = await getUCrvPrice(llamaService, signer);

      return calcMinAmountOut(input, ucrv, cvx, slippage);
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

      const ucrv = await getUCrvPrice(llamaService, signer);

      return calcMinAmountOut(input, ucrv, weth, slippage);
    },
  };

  const threeCrvAndStake: ZapClaim = {
    logo: logoCRV,
    label: "3CRV & Stake (Convex)",
    withdrawSymbol: "3CRV",
    withdrawDecimals: () => Promise.resolve(18n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: (minAmountOut?: bigint) => claimAs3PoolAndStake(minAmountOut ?? 0n),
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

      const ucrv = await getUCrvPrice(llamaService, signer);

      return calcMinAmountOut(input, ucrv, 1, slippage);
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

      const ucrv = await getUCrvPrice(llamaService, signer);

      return calcMinAmountOut(input, ucrv, 1, slippage);
    },
  };

  const options = [
    ucrv,
    cvxcrv,
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
