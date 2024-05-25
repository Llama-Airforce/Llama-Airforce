import { type JsonRpcSigner } from "@ethersproject/providers";
import { maxApprove } from "@/Wallet";
import { getProvider } from "@/Wallet/ProviderFactory";
import {
  CurveV1FactoryPool__factory,
  ERC20__factory,
  type UnionVaultPirex,
  ZapsUCvx__factory,
} from "@/Contracts";
import { DefiLlamaService } from "@/Services";
import { getCvxCrvPriceV2 } from "@/Util";
import {
  CrvAddress,
  CvxAddress,
  CvxCrvFactoryAddressV1,
  UnionCvxVaultAddress,
  WEthAddress,
  ZapsUCvxAddress,
} from "@/Util/Addresses";
import { type ZapWithdraw } from "@Pounders/Models/Zap";
import { calcMinAmountOut } from "@Pounders/Util/MinAmountOutHelper";
import { getUCvxPrice } from "@Pounders/Zaps/UCvx/PriceHelper";

import logoCRV from "@/Assets/Icons/Tokens/crv.svg";
import logoCVX from "@/Assets/Icons/Tokens/cvx.svg";
import logoETH from "@/Assets/Icons/Tokens/eth.svg";

// eslint-disable-next-line max-lines-per-function
export function uCvxWithdrawZaps(
  getAddress: () => string | undefined,
  getInput: () => bigint | null,
  getVault: () => UnionVaultPirex | undefined
): ZapWithdraw[] {
  const withdraw = async () => {
    const address = getAddress();
    const vault = getVault();
    const input = getInput();

    if (!address || !vault || !input) {
      throw new Error("Unable to construct withdraw zaps");
    }

    const ps = [input, address, address] as const;
    const estimate = await vault.estimateGas.redeem(...ps);
    const tx = await vault.redeem(...ps, {
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

    const utkn = ERC20__factory.connect(UnionCvxVaultAddress, signer);
    await maxApprove(utkn, address, ZapsUCvxAddress, input);

    return {
      zaps: ZapsUCvx__factory.connect(ZapsUCvxAddress, signer),
      address,
      input,
      vault,
    };
  };

  const withdrawAsCvx = async (minAmountOut: bigint) => {
    const x = await withdrawFactory();
    const ps = [x.input, minAmountOut, x.address] as const;

    const estimate = await x.zaps.estimateGas.claimFromVaultAsCvx(...ps);

    const tx = await x.zaps.claimFromVaultAsCvx(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const withdrawAsCvxCrv = async (minAmountOut: bigint) => {
    const x = await withdrawFactory();
    const ps = [x.input, minAmountOut, x.address] as const;

    const estimate = await x.zaps.estimateGas.claimFromVaultAsCvxCrv(...ps);

    const tx = await x.zaps.claimFromVaultAsCvxCrv(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const withdrawAsCrv = async (minAmountOut: bigint) => {
    const x = await withdrawFactory();
    const ps = [x.input, minAmountOut, x.address] as const;

    const estimate = await x.zaps.estimateGas.claimFromVaultAsCrv(...ps);

    const tx = await x.zaps.claimFromVaultAsCrv(...ps, {
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

  // Zaps
  const pxCVX: ZapWithdraw = {
    logo: logoCVX,
    label: "pxCVX",
    withdrawSymbol: "pxCVX",
    withdrawDecimals: () => Promise.resolve(18n),
    zap: () => withdraw(),
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

      const ucvx = await getUCvxPrice(llamaService, signer);

      return calcMinAmountOut(input, ucvx, cvx, slippage);
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const cvxCRV: ZapWithdraw = {
    logo: logoCRV,
    label: "cvxCRV",
    withdrawSymbol: "cvxCRV",
    withdrawDecimals: () => Promise.resolve(18n),
    zap: (minAmountOut?: bigint) => withdrawAsCvxCrv(minAmountOut ?? 0n),
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

      const ucvx = await getUCvxPrice(llamaService, signer);

      return calcMinAmountOut(input, ucvx, crv, slippage);
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

      const ucvx = await getUCvxPrice(llamaService, signer);

      return calcMinAmountOut(input, ucvx, weth, slippage);
    },
  };

  const options = [cvx, pxCVX, /* cvxCRV, crv, */ eth];

  return options;
}
