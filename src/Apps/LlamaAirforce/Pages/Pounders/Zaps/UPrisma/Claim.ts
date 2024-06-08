import { type JsonRpcSigner } from "@ethersproject/providers";
import { maxApprove } from "@/Wallet";
import {
  ERC20__factory,
  ZapsUPrismaClaim__factory,
  MerkleDistributor2__factory,
} from "@/Contracts";
import {
  UnionPrismaVaultAddress,
  ZapsUPrismaClaimAddress,
} from "@/Util/Addresses";
import type { Airdrop, ZapClaim, Swap } from "@Pounders/Models";

import logoAirforce from "@/Assets/Icons/Tokens/airforce.png";
import logoPRISMA from "@/Assets/Icons/Tokens/prisma.svg";

// eslint-disable-next-line max-lines-per-function
export function uPrismaClaimZaps(
  getSigner: () => JsonRpcSigner | undefined,
  getAddress: () => string | undefined,
  getAirdrop: () => Airdrop | undefined
): (ZapClaim | Swap)[] {
  const extraZapFactory = async () => {
    const address = getAddress();
    const airdrop = getAirdrop();
    const signer = getSigner();

    if (!address || !airdrop || !signer) {
      throw new Error("Unable to construct extra claim zaps");
    }

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
    const signer = getSigner();

    if (!airdrop || !address || !signer) {
      return;
    }

    const distributor = MerkleDistributor2__factory.connect(
      airdrop.distributorAddress,
      signer
    );

    const ps = [
      airdrop.claim.index,
      address,
      airdrop.amount,
      airdrop.claim.proof as string[],
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
      x.claim.proof as string[],
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
