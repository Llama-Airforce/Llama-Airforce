import { type JsonRpcSigner } from "@ethersproject/providers";
import { maxApprove } from "@/Wallet";
import { getProvider } from "@/Wallet/ProviderFactory";
import {
  type ERC20,
  ERC20__factory,
  ZapsUBal__factory,
  type UnionVault,
} from "@/Contracts";
import { getAuraBalPrice } from "@/Util";
import { ZapsUBalAddress, BalAddress, WEthAddress } from "@/Util/Addresses";
import { DefiLlamaService } from "@/Services";
import { type ZapDeposit } from "@Pounders/Models/Zap";
import { calcMinAmountOut } from "@Pounders/Util/MinAmountOutHelper";
import FlyerService from "@/Services/FlyerService";

import logoETH from "@/Assets/Icons/Tokens/eth.svg";
import logoWETH from "@/Assets/Icons/Tokens/weth.png";
import logoBAL from "@/Assets/Icons/Tokens/bal.png";
import logoAuraBAL from "@/Assets/Icons/Tokens/aurabal.png";

// eslint-disable-next-line max-lines-per-function
export function uBalDepositZaps(
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

      await maxApprove(depositERC20, address, ZapsUBalAddress, input);
    }

    return {
      zaps: ZapsUBal__factory.connect(ZapsUBalAddress, signer),
      address,
      input,
    };
  };

  const depositFromEth = async (minAmountOut: bigint) => {
    const x = await depositFactory(null);
    const ps = [minAmountOut, x.address, false] as const;

    const estimate = await x.zaps.estimateGas.depositFromEth(...ps, {
      value: x.input,
    });

    const tx = await x.zaps.depositFromEth(...ps, {
      value: x.input,
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const depositFromBal = async (minAmountOut: bigint) => {
    const x = await depositFactory(BalAddress);
    const ps = [minAmountOut, x.address, false] as const;

    const estimate = await x.zaps.estimateGas.depositFromUnderlyingAssets(
      [x.input, 0],
      ...ps
    );

    const tx = await x.zaps.depositFromUnderlyingAssets([x.input, 0], ...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const depositFromWeth = async (minAmountOut: bigint) => {
    const x = await depositFactory(WEthAddress);
    const ps = [minAmountOut, x.address, false] as const;

    const estimate = await x.zaps.estimateGas.depositFromUnderlyingAssets(
      [0, x.input],
      ...ps
    );

    const tx = await x.zaps.depositFromUnderlyingAssets([0, x.input], ...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  // Zaps
  const auraBAL: ZapDeposit = {
    logo: logoAuraBAL,
    label: "auraBAL",
    zap: () => deposit(),
    depositSymbol: "auraBAL",
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

  const bal: ZapDeposit = {
    logo: logoBAL,
    label: "BAL",
    zap: (minAmountOut?: bigint) => depositFromBal(minAmountOut ?? 0n),
    depositSymbol: "BAL",
    depositBalance: () => {
      const address = getAddress();
      const provider = getProvider();

      if (!address || !provider) {
        throw new Error("Unable to construct deposit zap balance");
      }

      const depositERC20 = ERC20__factory.connect(BalAddress, provider);
      return depositERC20.balanceOf(address).then((x) => x.toBigInt());
    },
    depositDecimals: () => {
      const provider = getProvider();

      if (!provider) {
        throw new Error("Unable to construct deposit zap decimals");
      }

      const depositERC20 = ERC20__factory.connect(BalAddress, provider);
      return depositERC20.decimals().then((x) => BigInt(x));
    },
    getMinAmountOut: async (
      host: string,
      _signer: JsonRpcSigner,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const llamaService = new DefiLlamaService(host);
      const flyerService = new FlyerService(host);

      const bal = await llamaService
        .getPrice(BalAddress)
        .then((x) => x.price)
        .catch(() => Infinity);

      const aurabal = await getAuraBalPrice(flyerService)
        .then((x) => x)
        .catch(() => Infinity);

      return calcMinAmountOut(input, bal, aurabal, slippage);
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
      _signer: JsonRpcSigner,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const llamaService = new DefiLlamaService(host);
      const flyerService = new FlyerService(host);

      const weth = await llamaService
        .getPrice(WEthAddress)
        .then((x) => x.price)
        .catch(() => Infinity);

      const aurabal = await getAuraBalPrice(flyerService)
        .then((x) => x)
        .catch(() => Infinity);

      return calcMinAmountOut(input, weth, aurabal, slippage);
    },
  };

  const weth: ZapDeposit = {
    logo: logoWETH,
    label: "WETH",
    zap: (minAmountOut?: bigint) => depositFromWeth(minAmountOut ?? 0n),
    depositSymbol: "WETH",
    depositBalance: () => {
      const address = getAddress();
      const provider = getProvider();

      if (!address || !provider) {
        throw new Error("Unable to construct deposit zap balance");
      }

      const depositERC20 = ERC20__factory.connect(WEthAddress, provider);
      return depositERC20.balanceOf(address).then((x) => x.toBigInt());
    },
    depositDecimals: () => {
      const provider = getProvider();

      if (!provider) {
        throw new Error("Unable to construct deposit zap decimals");
      }

      const depositERC20 = ERC20__factory.connect(WEthAddress, provider);
      return depositERC20.decimals().then((x) => BigInt(x));
    },
    getMinAmountOut: async (
      host: string,
      _signer: JsonRpcSigner,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const llamaService = new DefiLlamaService(host);
      const flyerService = new FlyerService(host);

      const weth = await llamaService
        .getPrice(WEthAddress)
        .then((x) => x.price)
        .catch(() => Infinity);

      const aurabal = await getAuraBalPrice(flyerService)
        .then((x) => x)
        .catch(() => Infinity);

      return calcMinAmountOut(input, weth, aurabal, slippage);
    },
  };

  const options = [auraBAL, bal, eth, weth];

  return options;
}
