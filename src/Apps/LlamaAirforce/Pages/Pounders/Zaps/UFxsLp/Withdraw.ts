import { type JsonRpcSigner } from "@ethersproject/providers";
import { maxApprove } from "@/Wallet";
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
  CvxFxsFactoryAddress,
  FxsAddress,
  UnionFxsVaultAddressV1,
  ZapsUFxsAddressV1,
} from "@/Util/Addresses";
import type { ZapWithdraw, Swap } from "@Pounders/Models";
import { calcMinAmountOut } from "@Pounders/Util/MinAmountOutHelper";

import logoFXS from "@/Assets/Icons/Tokens/fxs.png";

// eslint-disable-next-line max-lines-per-function
export function uFxsLpWithdrawZaps(
  getSigner: () => JsonRpcSigner | undefined,
  getAddress: () => string | undefined,
  getInput: () => bigint | null,
  getVault: () => UnionVault | undefined
): (ZapWithdraw | Swap)[] {
  const withdrawFactory = async () => {
    const address = getAddress();
    const vault = getVault();
    const input = getInput();
    const signer = getSigner();

    if (!address || !vault || !input || !signer) {
      throw new Error("Unable to construct extra withdraw zaps");
    }

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
    const signer = getSigner();

    if (!address || !vault || !input || !signer) {
      throw new Error("Unable to construct extra withdraw zaps");
    }

    const utkn = UnionVault__factory.connect(UnionFxsVaultAddressV1, signer);

    const ps = [address, input] as const;
    const estimate = await utkn.estimateGas.withdraw(...ps);
    const tx = await utkn.withdraw(...ps, {
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

  const options = [fxs, cvxFXS, cvxFXSLP];

  return options;
}
