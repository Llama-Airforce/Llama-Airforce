import { type JsonRpcSigner } from "@ethersproject/providers";
import { maxApprove } from "@/Wallet";
import {
  CurveV2FactoryPool__factory,
  ERC20__factory,
  ZapsUFxsLpClaim__factory,
  MerkleDistributor2__factory,
} from "@/Contracts";
import { DefiLlamaService } from "@/Services";
import { getCvxFxsPrice } from "@/Util";
import {
  CvxFxsFactoryAddress,
  FxsAddress,
  UnionFxsVaultAddressV1,
  ZapsUFxsClaimAddressV1,
} from "@/Util/Addresses";
import type { Airdrop, ZapClaim, Swap } from "@Pounders/Models";
import { calcMinAmountOut } from "@Pounders/Util/MinAmountOutHelper";
import { getUFxsPriceV1 } from "@Pounders/Zaps/UFxsLp/PriceHelper";

import logoAirforce from "@/Assets/Icons/Tokens/airforce.png";
import logoFXS from "@/Assets/Icons/Tokens/fxs.png";

// eslint-disable-next-line max-lines-per-function
export function uFxsLpClaimZaps(
  getSigner: () => JsonRpcSigner | undefined,
  getAddress: () => string | undefined,
  getAirdrop: () => Airdrop | null
): (ZapClaim | Swap)[] {
  const extraZapFactory = async () => {
    const address = getAddress();
    const airdrop = getAirdrop();
    const signer = getSigner();

    if (!address || !airdrop || !signer) {
      throw new Error("Unable to construct extra claim zaps");
    }

    const utkn = ERC20__factory.connect(UnionFxsVaultAddressV1, signer);
    await maxApprove(utkn, address, ZapsUFxsClaimAddressV1, airdrop.amount);

    return {
      extraZaps: ZapsUFxsLpClaim__factory.connect(
        ZapsUFxsClaimAddressV1,
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
    const signer = getSigner();

    if (!airdrop || !address || !signer) {
      return;
    }

    const distributor = MerkleDistributor2__factory.connect(
      airdrop.distributorAddress,
      signer
    );

    const ps = [
      airdrop.claim.index,
      address,
      airdrop.amount,
      airdrop.claim.proof as string[],
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
      x.claim.proof as string[],
      0,
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

  const claimAsCvxFxs = async (minAmountOut: bigint) => {
    const x = await extraZapFactory();
    const ps = [
      x.claim.index,
      x.address,
      x.amount,
      x.claim.proof as string[],
      1,
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

      const ufxs = await getUFxsPriceV1(llamaService, signer);

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

      const ufxs = await getUFxsPriceV1(llamaService, signer);

      return calcMinAmountOut(input, ufxs, cvxfxs, slippage);
    },
  };

  const options = [ufxs, fxs, cvxFXS];

  return options;
}
