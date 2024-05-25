import { type JsonRpcSigner } from "@ethersproject/providers";
import { maxApprove } from "@/Wallet";
import { getProvider } from "@/Wallet/ProviderFactory";
import {
  CurveV1FactoryPool__factory,
  CurveV2FactoryPool__factory,
  type ERC20,
  ERC20__factory,
  type UnionVaultPirex,
  ZapsUCvx__factory,
} from "@/Contracts";
import { DefiLlamaService } from "@/Services";
import { getCvxCrvPriceV2, getPxCvxPrice } from "@/Util";
import {
  CrvAddress,
  CvxAddress,
  CvxCrvAddress,
  CvxCrvFactoryAddressV1,
  LPxCvxFactoryAddress,
  WEthAddress,
  ZapsUCvxAddress,
} from "@/Util/Addresses";
import { type ZapDeposit } from "@Pounders/Models/Zap";
import { calcMinAmountOut } from "@Pounders/Util/MinAmountOutHelper";

import logoCRV from "@/Assets/Icons/Tokens/crv.svg";
import logoCVX from "@/Assets/Icons/Tokens/cvx.svg";
import logoETH from "@/Assets/Icons/Tokens/eth.svg";

async function shouldLock(input: bigint): Promise<boolean> {
  const provider = getProvider();

  if (!provider) {
    return false;
  }

  const curvePool = CurveV2FactoryPool__factory.connect(
    LPxCvxFactoryAddress,
    provider
  );

  const dy = await curvePool.get_dy(0, 1, input);

  // Lock when dy (what you get when swapping) is less than the input.
  return input >= dy.toBigInt();
}

async function shouldLockOracle(): Promise<boolean> {
  const provider = getProvider();

  if (!provider) {
    return false;
  }

  const curvePool = CurveV2FactoryPool__factory.connect(
    LPxCvxFactoryAddress,
    provider
  );

  const priceOracle = await curvePool.price_oracle();
  return priceOracle.toBigInt() >= 1000000000000000000n;
}

// eslint-disable-next-line max-lines-per-function
export function uCvxDepositZaps(
  getAddress: () => string | undefined,
  getInput: () => bigint | null,
  getVault: () => UnionVaultPirex | undefined,
  getAssetTkn: () => ERC20 | undefined
): ZapDeposit[] {
  const deposit = async () => {
    const address = getAddress();
    const vault = getVault();
    const input = getInput();
    const atkn = getAssetTkn();

    if (!address || !vault || !input || !atkn) {
      throw new Error("Unable to construct deposit zaps");
    }

    await maxApprove(atkn, address, vault.address, input);

    const ps = [input, address] as const;
    const estimate = await vault.estimateGas.deposit(...ps);
    const tx = await vault.deposit(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const depositFactory = async (depositTkn: string | null) => {
    const address = getAddress();
    const vault = getVault();
    const input = getInput();
    const provider = getProvider();

    if (!address || !vault || !input || !provider) {
      throw new Error("Unable to construct extra zaps");
    }

    const signer = provider.getSigner();

    if (depositTkn) {
      const depositERC20 = ERC20__factory.connect(depositTkn, signer);

      await maxApprove(depositERC20, address, ZapsUCvxAddress, input);
    }

    return {
      zaps: ZapsUCvx__factory.connect(ZapsUCvxAddress, signer),
      address,
      input,
    };
  };

  const depositFromCvx = async (minAmountOut: bigint) => {
    const x = await depositFactory(CvxAddress);
    const lock = await shouldLock(x.input);
    const ps = [x.input, minAmountOut, x.address, lock] as const;

    const estimate = await x.zaps.estimateGas.depositFromCvx(...ps);

    const tx = await x.zaps.depositFromCvx(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const depositFromEth = async (minAmountOut: bigint) => {
    const x = await depositFactory(null);
    const lock = await shouldLockOracle();
    const ps = [minAmountOut, x.address, lock] as const;

    const estimate = await x.zaps.estimateGas.depositFromEth(...ps, {
      value: x.input,
    });

    const tx = await x.zaps.depositFromEth(...ps, {
      value: x.input,
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const depositFromCrv = async (minAmountOut: bigint) => {
    const x = await depositFactory(CrvAddress);
    const lock = await shouldLockOracle();
    const ps = [x.input, minAmountOut, x.address, lock] as const;

    const estimate = await x.zaps.estimateGas.depositFromCrv(...ps);

    const tx = await x.zaps.depositFromCrv(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const depositFromCvxCrv = async (minAmountOut: bigint) => {
    const x = await depositFactory(CvxCrvAddress);
    const lock = await shouldLockOracle();
    const ps = [x.input, minAmountOut, x.address, lock] as const;

    const estimate = await x.zaps.estimateGas.depositFromCvxCrv(...ps);

    const tx = await x.zaps.depositFromCvxCrv(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  // Zaps
  const cvx: ZapDeposit = {
    logo: logoCVX,
    label: "CVX",
    zap: (minAmountOut?: bigint) => depositFromCvx(minAmountOut ?? 0n),
    depositSymbol: "CVX",
    depositBalance: () => {
      const address = getAddress();
      const provider = getProvider();

      if (!address || !provider) {
        throw new Error("Unable to construct deposit zap balance");
      }

      const depositERC20 = ERC20__factory.connect(CvxAddress, provider);
      return depositERC20.balanceOf(address).then((x) => x.toBigInt());
    },
    depositDecimals: () => {
      const provider = getProvider();

      if (!provider) {
        throw new Error("Unable to construct deposit zap decimals");
      }

      const depositERC20 = ERC20__factory.connect(CvxAddress, provider);
      return depositERC20.decimals().then((x) => BigInt(x));
    },
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

      const factory = CurveV2FactoryPool__factory.connect(
        LPxCvxFactoryAddress,
        signer
      );
      const pxcvx = await getPxCvxPrice(llamaService, factory)
        .then((x) => x)
        .catch(() => Infinity);

      return calcMinAmountOut(input, cvx, pxcvx, slippage);
    },
  };

  const pxCVX: ZapDeposit = {
    logo: logoCVX,
    label: "pxCVX",
    zap: () => deposit(),
    depositSymbol: "pxCVX",
    depositBalance: async () => {
      const address = getAddress();
      const atkn = getAssetTkn();

      if (!address || !atkn) {
        throw new Error("Unable to construct deposit zap balance");
      }

      return await atkn.balanceOf(address).then((x) => x.toBigInt());
    },
    depositDecimals: async () => {
      const atkn = getAssetTkn();

      if (!atkn) {
        throw new Error("Unable to construct deposit zap decimals");
      }

      return await atkn.decimals().then((x) => BigInt(x));
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const cvxCRV: ZapDeposit = {
    logo: logoCRV,
    label: "cvxCRV",
    zap: (minAmountOut?: bigint) => depositFromCvxCrv(minAmountOut ?? 0n),
    depositSymbol: "cvxCRV",
    depositBalance: async () => {
      const address = getAddress();
      const provider = getProvider();

      if (!address || !provider) {
        throw new Error("Unable to construct deposit zap balance");
      }

      const depositERC20 = ERC20__factory.connect(CvxCrvAddress, provider);
      return depositERC20.balanceOf(address).then((x) => x.toBigInt());
    },
    depositDecimals: async () => {
      const provider = getProvider();

      if (!provider) {
        throw new Error("Unable to construct deposit zap decimals");
      }

      const depositERC20 = ERC20__factory.connect(CvxCrvAddress, provider);
      return depositERC20.decimals().then((x) => BigInt(x));
    },
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

      const factoryPxCvx = CurveV2FactoryPool__factory.connect(
        LPxCvxFactoryAddress,
        signer
      );
      const pxcvx = await getPxCvxPrice(llamaService, factoryPxCvx)
        .then((x) => x)
        .catch(() => Infinity);

      return calcMinAmountOut(input, cvxcrv, pxcvx, slippage);
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const crv: ZapDeposit = {
    logo: logoCRV,
    label: "CRV",
    zap: (minAmountOut?: bigint) => depositFromCrv(minAmountOut ?? 0n),
    depositSymbol: "CRV",
    depositBalance: () => {
      const address = getAddress();
      const provider = getProvider();

      if (!address || !provider) {
        throw new Error("Unable to construct deposit zap balance");
      }

      const depositERC20 = ERC20__factory.connect(CrvAddress, provider);
      return depositERC20.balanceOf(address).then((x) => x.toBigInt());
    },
    depositDecimals: () => {
      const provider = getProvider();

      if (!provider) {
        throw new Error("Unable to construct deposit zap decimals");
      }

      const depositERC20 = ERC20__factory.connect(CrvAddress, provider);
      return depositERC20.decimals().then((x) => BigInt(x));
    },
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

      const factory = CurveV2FactoryPool__factory.connect(
        LPxCvxFactoryAddress,
        signer
      );
      const pxcvx = await getPxCvxPrice(llamaService, factory)
        .then((x) => x)
        .catch(() => Infinity);

      return calcMinAmountOut(input, crv, pxcvx, slippage);
    },
  };

  const eth: ZapDeposit = {
    logo: logoETH,
    label: "ETH",
    zap: (minAmountOut?: bigint) => depositFromEth(minAmountOut ?? 0n),
    depositSymbol: "ETH",
    depositBalance: () => {
      const address = getAddress();
      const provider = getProvider();

      if (!address || !provider) {
        throw new Error("Unable to construct deposit zap balance");
      }

      return provider.getBalance(address).then((x) => x.toBigInt());
    },
    depositDecimals: () => Promise.resolve(18n),
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

      const factory = CurveV2FactoryPool__factory.connect(
        LPxCvxFactoryAddress,
        signer
      );
      const pxcvx = await getPxCvxPrice(llamaService, factory)
        .then((x) => x)
        .catch(() => Infinity);

      return calcMinAmountOut(input, weth, pxcvx, slippage);
    },
  };

  const options = [cvx, pxCVX, /* cvxCRV, crv, */ eth];

  return options;
}
