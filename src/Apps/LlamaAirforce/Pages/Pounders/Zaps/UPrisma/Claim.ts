import { maxApprove } from "@/Wallet";
import { getProvider } from "@/Wallet/ProviderFactory";
import { ERC20__factory, ZapsUPrismaClaim__factory } from "@/Contracts";
import {
  UnionPrismaVaultAddress,
  ZapsUPrismaClaimAddress,
} from "@/Util/Addresses";
import type { Airdrop, ZapClaim, Swap } from "@Pounders/Models";

import logoAirforce from "@/Assets/Icons/Tokens/airforce.png";
import logoPRISMA from "@/Assets/Icons/Tokens/prisma.svg";

// eslint-disable-next-line max-lines-per-function
export function uPrismaClaimZaps(
  getAddress: () => string | undefined,
  getAirdrop: () => Airdrop | null
): (ZapClaim | Swap)[] {
  const extraZapFactory = async () => {
    const address = getAddress();
    const airdrop = getAirdrop();
    const provider = getProvider();

    if (!address || !airdrop || !provider) {
      throw new Error("Unable to construct extra claim zaps");
    }

    const signer = provider.getSigner();

    const utkn = ERC20__factory.connect(UnionPrismaVaultAddress, signer);
    await maxApprove(utkn, address, ZapsUPrismaClaimAddress, airdrop.amount);

    return {
      extraZaps: ZapsUPrismaClaim__factory.connect(
        ZapsUPrismaClaimAddress,
        signer
      ),
      address,
      amount: airdrop.amount,
      claim: airdrop.claim,
    };
  };

  const claim = async () => {
    const address = getAddress();
    const airdrop = getAirdrop();

    if (!airdrop || !address) {
      return;
    }

    const distributor = airdrop.distributor();
    const ps = [
      airdrop.claim.index,
      address,
      airdrop.amount,
      airdrop.claim.proof,
    ] as const;

    const estimate = await distributor.estimateGas.claim(...ps);

    const tx = await distributor.claim(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  const claimAsCvxPrisma = async () => {
    const x = await extraZapFactory();
    const ps = [
      x.claim.index,
      x.address,
      x.amount,
      x.claim.proof,
      x.address,
    ] as const;

    const estimate =
      await x.extraZaps.estimateGas.claimFromDistributorAsUnderlying(...ps);

    const tx = await x.extraZaps.claimFromDistributorAsUnderlying(...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  // Zaps
  const uprisma: ZapClaim = {
    logo: logoAirforce,
    label: "uPRISMA",
    withdrawSymbol: "uPRISMA",
    withdrawDecimals: () => Promise.resolve(18n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: () => claim(),
  };

  const cvxPRISMA: ZapClaim = {
    logo: logoPRISMA,
    label: "cvxPRISMA",
    withdrawSymbol: "cvxPRISMA",
    withdrawDecimals: () => Promise.resolve(18n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: () => claimAsCvxPrisma(),
  };

  const swap: Swap = {
    buy: "ETH",
    sell: "cvxPRISMA",
  };

  const options = [uprisma, cvxPRISMA, swap];

  return options;
}
