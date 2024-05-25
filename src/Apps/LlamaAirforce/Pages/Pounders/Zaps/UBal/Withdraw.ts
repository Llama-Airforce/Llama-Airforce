import { type JsonRpcSigner } from "@ethersproject/providers";
import { maxApprove } from "@/Wallet";
import { getProvider } from "@/Wallet/ProviderFactory";
import { DefiLlamaService } from "@/Services";
import {
  ERC20__factory,
  ZapsUBal__factory,
  type UnionVault,
} from "@/Contracts";
import {
  ZapsUBalAddress,
  UnionBalVaultAddress,
  WEthAddress,
  BalAddress,
} from "@/Util/Addresses";
import { type ZapWithdraw } from "@Pounders/Models/Zap";
import FlyerService from "@/Services/FlyerService";
import { calcMinAmountOut } from "@Pounders/Util/MinAmountOutHelper";
import { getUBalPrice } from "@Pounders/Zaps/UBal/PriceHelper";

import logoETH from "@/Assets/Icons/Tokens/eth.svg";
import logoWETH from "@/Assets/Icons/Tokens/weth.png";
import logoBAL from "@/Assets/Icons/Tokens/bal.png";
import logoAuraBAL from "@/Assets/Icons/Tokens/aurabal.png";
import logoUSDC from "@/Assets/Icons/Tokens/usdc.svg";

// eslint-disable-next-line max-lines-per-function
export function uBalWithdrawZaps(
  getAddress: () => string | undefined,
  getInput: () => bigint | null,
  getVault: () => UnionVault | undefined
): ZapWithdraw[] {
  const withdraw = async () => {
    const address = getAddress();
    const vault = getVault();
    const input = getInput();

    if (!address || !vault || !input) {
      throw new Error("Unable to construct withdraw zaps");
    }

    const ps = [address, input] as const;

    const estimate = await vault.estimateGas.withdraw(...ps);
    const tx = await vault.withdraw(...ps, {
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

    const utkn = ERC20__factory.connect(UnionBalVaultAddress, signer);
    await maxApprove(utkn, address, ZapsUBalAddress, input);

    return {
      zaps: ZapsUBal__factory.connect(ZapsUBalAddress, signer),
      address,
      input,
      vault,
    };
  };

  const withdrawAsBal = async (minAmountOut: bigint) => {
    const x = await withdrawFactory();
    const ps = [x.input, 0, minAmountOut, x.address, false] as const;

    const estimate = await x.zaps.estimateGas.claimFromVaultAsUnderlying(...ps);

    const tx = await x.zaps.claimFromVaultAsUnderlying(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const withdrawAsEth = async (minAmountOut: bigint) => {
    const x = await withdrawFactory();
    const ps = [x.input, 1, minAmountOut, x.address, false] as const;

    const estimate = await x.zaps.estimateGas.claimFromVaultAsUnderlying(...ps);

    const tx = await x.zaps.claimFromVaultAsUnderlying(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const withdrawAsWeth = async (minAmountOut: bigint) => {
    const x = await withdrawFactory();
    const ps = [x.input, 1, minAmountOut, x.address, true] as const;

    const estimate = await x.zaps.estimateGas.claimFromVaultAsUnderlying(...ps);

    const tx = await x.zaps.claimFromVaultAsUnderlying(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const withdrawAsUsdc = async (minAmountOut: bigint) => {
    const x = await withdrawFactory();
    const ps = [
      x.input,
      minAmountOut,
      "0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f",
      "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      x.address,
    ] as const;

    const estimate = await x.zaps.estimateGas.claimFromVaultViaUniV2EthPair(
      ...ps
    );

    const tx = await x.zaps.claimFromVaultViaUniV2EthPair(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  // Zaps
  const auraBAL: ZapWithdraw = {
    logo: logoAuraBAL,
    label: "auraBAL",
    withdrawSymbol: "auraBAL",
    withdrawDecimals: () => Promise.resolve(18n),
    zap: () => withdraw(),
  };

  const bal: ZapWithdraw = {
    logo: logoBAL,
    label: "BAL",
    withdrawSymbol: "BAL",
    withdrawDecimals: () => Promise.resolve(18n),
    zap: (minAmountOut?: bigint) => withdrawAsBal(minAmountOut ?? 0n),
    getMinAmountOut: async (
      host: string,
      signer: JsonRpcSigner,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const llamaService = new DefiLlamaService(host);
      const flyerService = new FlyerService(host);

      const bal = await llamaService
        .getPrice(BalAddress)
        .then((x) => x.price)
        .catch(() => Infinity);

      const ubal = await getUBalPrice(flyerService, signer);

      return calcMinAmountOut(input, ubal, bal, slippage);
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
      const flyerService = new FlyerService(host);

      const weth = await llamaService
        .getPrice(WEthAddress)
        .then((x) => x.price)
        .catch(() => Infinity);

      const ubal = await getUBalPrice(flyerService, signer);

      return calcMinAmountOut(input, ubal, weth, slippage);
    },
  };

  const weth: ZapWithdraw = {
    logo: logoWETH,
    label: "WETH",
    withdrawSymbol: "WETH",
    withdrawDecimals: () => Promise.resolve(18n),
    zap: (minAmountOut?: bigint) => withdrawAsWeth(minAmountOut ?? 0n),
    getMinAmountOut: async (
      host: string,
      signer: JsonRpcSigner,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const llamaService = new DefiLlamaService(host);
      const flyerService = new FlyerService(host);

      const weth = await llamaService
        .getPrice(WEthAddress)
        .then((x) => x.price)
        .catch(() => Infinity);

      const ubal = await getUBalPrice(flyerService, signer);

      return calcMinAmountOut(input, ubal, weth, slippage);
    },
  };

  const usdc: ZapWithdraw = {
    logo: logoUSDC,
    label: "USDC",
    withdrawSymbol: "USDC",
    withdrawDecimals: () => Promise.resolve(6n),
    zap: (minAmountOut?: bigint) => withdrawAsUsdc(minAmountOut ?? 0n),
    getMinAmountOut: async (
      host: string,
      signer: JsonRpcSigner,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const flyerService = new FlyerService(host);

      const ubal = await getUBalPrice(flyerService, signer);

      return calcMinAmountOut(input, ubal, 1, slippage);
    },
  };

  const options = [auraBAL, bal, eth, weth, usdc];

  return options;
}
