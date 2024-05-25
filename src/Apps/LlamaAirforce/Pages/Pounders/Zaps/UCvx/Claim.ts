import { type JsonRpcSigner } from "@ethersproject/providers";
import { maxApprove } from "@/Wallet";
import { getProvider } from "@/Wallet/ProviderFactory";
import { DefiLlamaService } from "@/Services";
import {
  CurveV1FactoryPool__factory,
  ERC20__factory,
  ZapsUCvxClaim__factory,
} from "@/Contracts";
import { getCvxCrvPriceV2 } from "@/Util";
import {
  CrvAddress,
  CvxAddress,
  CvxCrvFactoryAddressV1,
  UnionCvxVaultAddress,
  WEthAddress,
  ZapsUCvxClaimAddress,
} from "@/Util/Addresses";
import { type Airdrop } from "@Pounders/Models/Airdrop";
import { type ZapClaim } from "@Pounders/Models/Zap";
import { calcMinAmountOut } from "@Pounders/Util/MinAmountOutHelper";
import { getUCvxPrice } from "@Pounders/Zaps/UCvx/PriceHelper";

import logoAirforce from "@/Assets/Icons/Tokens/airforce.png";
import logoCRV from "@/Assets/Icons/Tokens/crv.svg";
import logoCVX from "@/Assets/Icons/Tokens/cvx.svg";
import logoETH from "@/Assets/Icons/Tokens/eth.svg";

// eslint-disable-next-line max-lines-per-function
export function uCvxClaimZaps(
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

  const extraZapFactory = async () => {
    const address = getAddress();
    const airdrop = getAirdrop();
    const provider = getProvider();

    if (!address || !airdrop || !provider) {
      throw new Error("Unable to construct extra claim zaps");
    }

    const signer = provider.getSigner();

    const utkn = ERC20__factory.connect(UnionCvxVaultAddress, signer);
    await maxApprove(utkn, address, ZapsUCvxClaimAddress, airdrop.amount);

    return {
      extraZaps: ZapsUCvxClaim__factory.connect(ZapsUCvxClaimAddress, signer),
      address,
      amount: airdrop.amount,
      claim: airdrop.claim,
    };
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
    ] as const;

    const estimate = await x.extraZaps.estimateGas.claimFromDistributorAsCvx(
      ...ps
    );

    const tx = await x.extraZaps.claimFromDistributorAsCvx(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const claimAsCvxCrv = async (minAmountOut: bigint) => {
    const x = await extraZapFactory();
    const ps = [
      x.claim.index,
      x.address,
      x.amount,
      x.claim.proof,
      minAmountOut,
      x.address,
    ] as const;

    const estimate = await x.extraZaps.estimateGas.claimFromDistributorAsCvxCrv(
      ...ps
    );

    const tx = await x.extraZaps.claimFromDistributorAsCvxCrv(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const claimAsCrv = async (minAmountOut: bigint) => {
    const x = await extraZapFactory();
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

  // Zaps
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

      const ucvx = await getUCvxPrice(llamaService, signer);

      return calcMinAmountOut(input, ucvx, cvx, slippage);
    },
  };

  const ucvx: ZapClaim = {
    logo: logoAirforce,
    label: "uCVX",
    withdrawSymbol: "uCVX",
    withdrawDecimals: () => Promise.resolve(18n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: () => claim(),
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const cvxCRV: ZapClaim = {
    logo: logoCRV,
    label: "cvxCRV",
    withdrawSymbol: "cvxCRV",
    withdrawDecimals: () => Promise.resolve(18n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: (minAmountOut?: bigint) => claimAsCvxCrv(minAmountOut ?? 0n),
    getMinAmountOut: async (
      host: string,
      signer: JsonRpcSigner,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const llamaService = new DefiLlamaService(host);

      const factoryCvxCrv = CurveV1FactoryPool__factory.connect(
        CvxCrvFactoryAddressV1,
        signer
      );
      let cvxcrv = await getCvxCrvPriceV2(llamaService, factoryCvxCrv);
      cvxcrv = cvxcrv > 0 ? cvxcrv : Infinity;

      const ucvx = await getUCvxPrice(llamaService, signer);

      return calcMinAmountOut(input, ucvx, cvxcrv, slippage);
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

      const ucvx = await getUCvxPrice(llamaService, signer);

      return calcMinAmountOut(input, ucvx, crv, slippage);
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

      const ucvx = await getUCvxPrice(llamaService, signer);

      return calcMinAmountOut(input, ucvx, weth, slippage);
    },
  };

  const options = [cvx, ucvx, /* cvxCRV, crv,*/ eth];

  return options;
}
