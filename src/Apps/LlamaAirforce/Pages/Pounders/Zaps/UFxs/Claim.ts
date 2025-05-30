import { abi as abiZaps } from "@/ABI/Union/ZapsUFxsClaim";
import logoAirforce from "@/Assets/Icons/Tokens/airforce.png";
import logoFXS from "@/Assets/Icons/Tokens/fxs.png";
import { PriceService } from "@/Services";
import type { Address } from "@/types/address";
import { getCvxFxsPrice } from "@/Utils/Price";
import { maxApprove } from "@/Utils/Wallet";
import type { Airdrop, ZapClaim } from "@Pounders/Models";
import { claim, calcMinAmountOut } from "@Pounders/Zaps/Helpers";
import { getUFxsPrice } from "@Pounders/Zaps/UFxs/PriceHelper";

export function uFxsClaimZaps(
  getConfig: () => Config,
  getAddress: () => Address | undefined,
  getAirdrop: () => Airdrop | undefined
): ZapClaim[] {
  const claimAsCvxFxs = async (minAmountOut: bigint) => {
    const config = getConfig();
    const address = getAddress();
    const airdrop = getAirdrop();

    if (!address || !airdrop) {
      throw new Error("Unable to construct extra claim zaps");
    }

    await maxApprove(
      config,
      UnionFxsVaultAddress,
      address,
      ZapsUFxsClaimAddress,
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
      address: ZapsUFxsClaimAddress,
      functionName: "claimFromDistributorAsUnderlying",
      args,
    });

    return waitForTransactionReceipt(config, { hash });
  };

  // Zaps
  const ufxs: ZapClaim = {
    logo: logoAirforce,
    label: "uFXS",
    withdrawSymbol: "uFXS",
    withdrawDecimals: () => Promise.resolve(18n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: () => claim(getConfig, getAddress, getAirdrop),
  };

  const cvxFXS: ZapClaim = {
    logo: logoFXS,
    label: "cvxFXS",
    withdrawSymbol: "cvxFXS",
    withdrawDecimals: () => Promise.resolve(18n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: (minAmountOut?: bigint) => claimAsCvxFxs(minAmountOut ?? 0n),
    getMinAmountOut: async (
      host: string,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const priceService = new PriceService(Promise.resolve(host));

      const config = getConfig();
      const client = getPublicClient(config);
      if (!client) throw Error("Cannot create public viem client");

      const cvxfxs = await getCvxFxsPrice(priceService, client)
        .then((x) => x)
        .catch(() => Infinity);

      const ufxs = await getUFxsPrice(priceService, config);

      return calcMinAmountOut(input, ufxs, cvxfxs, slippage);
    },
  };

  const options = [ufxs, cvxFXS];

  return options;
}
