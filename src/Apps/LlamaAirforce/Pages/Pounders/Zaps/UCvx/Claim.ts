import { type Address } from "viem";
import {
  type Config,
  writeContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { abi as abiZaps } from "@/ABI/Union/ZapsUCvxClaim";
import { maxApprove } from "@/Wallet";
import { DefiLlamaService } from "@/Services";
import type { Airdrop, ZapClaim, Swap } from "@Pounders/Models";
import { calcMinAmountOut } from "@Pounders/Zaps/Helpers";
import { getUCvxPrice } from "@Pounders/Zaps/UCvx/PriceHelper";
import { claim } from "@Pounders/Zaps/Helpers";

import {
  CvxAddress,
  UnionCvxVaultAddress,
  ZapsUCvxClaimAddress,
} from "@/Util/Addresses";

import logoAirforce from "@/Assets/Icons/Tokens/airforce.png";
import logoCVX from "@/Assets/Icons/Tokens/cvx.svg";

// eslint-disable-next-line max-lines-per-function
export function uCvxClaimZaps(
  getConfig: () => Config,
  getAddress: () => Address | undefined,
  getAirdrop: () => Airdrop | undefined
): (ZapClaim | Swap)[] {
  const claimAsCvx = async (minAmountOut: bigint) => {
    const config = getConfig();
    const address = getAddress();
    const airdrop = getAirdrop();

    if (!address || !airdrop) {
      throw new Error("Unable to construct extra claim zaps");
    }

    await maxApprove(
      config,
      UnionCvxVaultAddress,
      address,
      ZapsUCvxClaimAddress,
      airdrop.amount
    );

    const args = [
      airdrop.claim.index,
      address,
      airdrop.amount,
      airdrop.claim.proof,
      minAmountOut,
      address,
    ] as const;

    const hash = await writeContract(config, {
      abi: abiZaps,
      address: ZapsUCvxClaimAddress,
      functionName: "claimFromDistributorAsCvx",
      args,
    });

    return waitForTransactionReceipt(config, { hash });
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
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const llamaService = new DefiLlamaService(host);

      const cvx = await llamaService
        .getPrice(CvxAddress)
        .then((x) => x.price)
        .catch(() => Infinity);

      const ucvx = await getUCvxPrice(llamaService, getConfig());

      return calcMinAmountOut(input, ucvx, cvx, slippage);
    },
  };

  const ucvx: ZapClaim = {
    logo: logoAirforce,
    label: "uCVX",
    withdrawSymbol: "uCVX",
    withdrawDecimals: () => Promise.resolve(18n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: () => claim(getConfig, getAddress, getAirdrop),
  };

  const swap: Swap = {
    buy: "CVX",
    sell: "ETH",
  };

  const options = [cvx, ucvx, swap];

  return options;
}
