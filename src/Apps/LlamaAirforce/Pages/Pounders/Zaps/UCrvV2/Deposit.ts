import { type JsonRpcSigner } from "@ethersproject/providers";
import { maxApprove } from "@/Wallet";
import { getProvider } from "@/Wallet/ProviderFactory";
import {
  type ERC20,
  ERC20__factory,
  ZapsUCrvV2__factory,
  type UnionVault,
  CurveV1FactoryPool__factory,
} from "@/Contracts";
import { getCvxCrvPriceV2 } from "@/Util";
import { DefiLlamaService } from "@/Services";
import {
  CrvAddress,
  CvxCrvFactoryAddressV1,
  WEthAddress,
  ZapsUCrvAddressV2,
} from "@/Util/Addresses";
import { type ZapDeposit } from "@Pounders/Models/Zap";
import { calcMinAmountOut } from "@Pounders/Util/MinAmountOutHelper";

import logoCRV from "@/Assets/Icons/Tokens/crv.svg";
import logoETH from "@/Assets/Icons/Tokens/eth.svg";

// eslint-disable-next-line max-lines-per-function
export function uCrvV2DepositZaps(
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

  const extraZapFactory = async (depositTkn: string | null) => {
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

      await maxApprove(depositERC20, address, ZapsUCrvAddressV2, input);
    }

    return {
      extraZaps: ZapsUCrvV2__factory.connect(ZapsUCrvAddressV2, signer),
      address,
      input,
    };
  };

  const depositFromCrv = async (minAmountOut: bigint) => {
    const x = await extraZapFactory(CrvAddress);
    const ps = [x.input, minAmountOut, x.address] as const;

    const estimate = await x.extraZaps.estimateGas.depositFromCrv(...ps);

    const tx = await x.extraZaps.depositFromCrv(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const depositFromEth = async (minAmountOut: bigint) => {
    const x = await extraZapFactory(null);
    const ps = [minAmountOut, x.address] as const;

    const estimate = await x.extraZaps.estimateGas.depositFromEth(...ps, {
      value: x.input,
    });

    const tx = await x.extraZaps.depositFromEth(...ps, {
      value: x.input,
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  // Zaps
  const cvxCRV: ZapDeposit = {
    logo: logoCRV,
    label: "cvxCRV",
    zap: () => deposit(),
    depositSymbol: "cvxCRV",
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

      const factory = CurveV1FactoryPool__factory.connect(
        CvxCrvFactoryAddressV1,
        signer
      );
      const cvxcrv = await getCvxCrvPriceV2(llamaService, factory)
        .then((x) => x)
        .catch(() => Infinity);

      return calcMinAmountOut(input, crv, cvxcrv, slippage);
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

      const factory = CurveV1FactoryPool__factory.connect(
        CvxCrvFactoryAddressV1,
        signer
      );
      const cvxcrv = await getCvxCrvPriceV2(llamaService, factory)
        .then((x) => x)
        .catch(() => Infinity);

      return calcMinAmountOut(input, weth, cvxcrv, slippage);
    },
  };

  const options = [cvxCRV /*crv, eth*/];

  return options;
}
