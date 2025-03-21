import { abi as abiZaps } from "@/ABI/Union/ZapsUCvxClaim";
import logoAirforce from "@/Assets/Icons/Tokens/airforce.png";
import logoCVX from "@/Assets/Icons/Tokens/cvx.svg";
import { PriceService } from "@/Services";
import type { Address } from "@/types/address";
import { maxApprove } from "@/Utils/Wallet";
import type { Airdrop, ZapClaim } from "@Pounders/Models";
import { calcMinAmountOut, claim } from "@Pounders/Zaps/Helpers";
import { getUCvxPrice } from "@Pounders/Zaps/UCvx/PriceHelper";

export function uCvxClaimZaps(
  getConfig: () => Config,
  getAddress: () => Address | undefined,
  getAirdrop: () => Airdrop | undefined
): ZapClaim[] {
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
      BigInt(airdrop.claim.index),
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
      const priceService = new PriceService(Promise.resolve(host));

      const cvx = await priceService
        .getPrice(CvxAddress)
        .then((x) => x?.price ?? Infinity)
        .catch(() => Infinity);

      const ucvx = await getUCvxPrice(priceService, getConfig());

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

  const options = [cvx, ucvx];

  return options;
}
