import { type JsonRpcSigner } from "@ethersproject/providers";
import { maxApprove } from "@/Wallet";
import { getProvider } from "@/Wallet/ProviderFactory";
import {
  ERC20__factory,
  type UnionVaultPirex,
  ZapsUCvx__factory,
} from "@/Contracts";
import { DefiLlamaService } from "@/Services";
import {
  CvxAddress,
  UnionCvxVaultAddress,
  ZapsUCvxAddress,
} from "@/Util/Addresses";
import type { ZapWithdraw, Swap } from "@Pounders/Models";
import { calcMinAmountOut } from "@Pounders/Util/MinAmountOutHelper";
import { getUCvxPrice } from "@Pounders/Zaps/UCvx/PriceHelper";

import logoCVX from "@/Assets/Icons/Tokens/cvx.svg";

// eslint-disable-next-line max-lines-per-function
export function uCvxWithdrawZaps(
  getAddress: () => string | undefined,
  getInput: () => bigint | null,
  getVault: () => UnionVaultPirex | undefined
): (ZapWithdraw | Swap)[] {
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

  const swap: Swap = {
    buy: "ETH",
    sell: "CVX",
  };

  const options = [cvx, pxCVX, swap];

  return options;
}
