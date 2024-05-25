import { type JsonRpcSigner } from "@ethersproject/providers";
import { maxApprove } from "@/Wallet";
import { getProvider } from "@/Wallet/ProviderFactory";
import {
  type ERC20,
  ERC20__factory,
  ZapsUFxs__factory,
  type UnionVault,
  CurveV2FactoryPool__factory,
} from "@/Contracts";
import { DefiLlamaService } from "@/Services";
import { getCvxFxsPrice } from "@/Util";
import {
  ZapsUFxsAddress,
  FxsAddress,
  WEthAddress,
  CvxFxsFactoryAddress,
} from "@/Util/Addresses";
import { type ZapDeposit } from "@Pounders/Models/Zap";
import { calcMinAmountOut } from "@Pounders/Util/MinAmountOutHelper";

import logoFXS from "@/Assets/Icons/Tokens/fxs.png";
import logoETH from "@/Assets/Icons/Tokens/eth.svg";

async function shouldLock(input: bigint): Promise<boolean> {
  const provider = getProvider();

  if (!provider) {
    return false;
  }

  const curvePool = CurveV2FactoryPool__factory.connect(
    CvxFxsFactoryAddress,
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
    CvxFxsFactoryAddress,
    provider
  );

  const priceOracle = await curvePool.price_oracle();
  return priceOracle.toBigInt() >= 1000000000000000000n;
}

// eslint-disable-next-line max-lines-per-function
export function uFxsDepositZaps(
  getAddress: () => string | undefined,
  getInput: () => bigint | null,
  getVault: () => UnionVault | undefined,
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

    const ps = [address, input] as const;
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

      await maxApprove(depositERC20, address, ZapsUFxsAddress, input);
    }

    return {
      zaps: ZapsUFxs__factory.connect(ZapsUFxsAddress, signer),
      address,
      input,
    };
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

  const depositFromFxs = async (minAmountOut: bigint) => {
    const x = await depositFactory(FxsAddress);
    const lock = await shouldLock(x.input);
    const ps = [x.input, minAmountOut, x.address, lock] as const;

    const estimate = await x.zaps.estimateGas.depositFromFxs(...ps);

    const tx = await x.zaps.depositFromFxs(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  // Zaps
  const cvxFXS: ZapDeposit = {
    logo: logoFXS,
    label: "cvxFXS",
    zap: () => deposit(),
    depositSymbol: "cvxFXS",
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

  const fxs: ZapDeposit = {
    logo: logoFXS,
    label: "FXS",
    zap: (minAmountOut?: bigint) => depositFromFxs(minAmountOut ?? 0n),
    depositSymbol: "FXS",
    depositBalance: async () => {
      const address = getAddress();
      const provider = getProvider();

      if (!address || !provider) {
        throw new Error("Unable to construct deposit zap balance");
      }

      const depositERC20 = ERC20__factory.connect(FxsAddress, provider);
      return depositERC20.balanceOf(address).then((x) => x.toBigInt());
    },
    depositDecimals: () => {
      const provider = getProvider();

      if (!provider) {
        throw new Error("Unable to construct deposit zap decimals");
      }

      const depositERC20 = ERC20__factory.connect(FxsAddress, provider);
      return depositERC20.decimals().then((x) => BigInt(x));
    },
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

      const factory = CurveV2FactoryPool__factory.connect(
        CvxFxsFactoryAddress,
        signer
      );

      const cvxfxs = await getCvxFxsPrice(llamaService, factory)
        .then((x) => x)
        .catch(() => Infinity);

      return calcMinAmountOut(input, fxs, cvxfxs, slippage);
    },
  };

  const eth: ZapDeposit = {
    logo: logoETH,
    label: "ETH",
    zap: (minAmountOut?: bigint) => depositFromEth(minAmountOut ?? 0n),
    depositSymbol: "ETH",
    depositBalance: async () => {
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
        CvxFxsFactoryAddress,
        signer
      );

      const cvxfxs = await getCvxFxsPrice(llamaService, factory)
        .then((x) => x)
        .catch(() => Infinity);

      return calcMinAmountOut(input, weth, cvxfxs, slippage);
    },
  };

  const options = [cvxFXS, fxs, eth];

  return options;
}
