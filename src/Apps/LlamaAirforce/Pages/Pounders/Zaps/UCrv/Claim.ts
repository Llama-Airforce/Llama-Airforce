import { type JsonRpcSigner } from "@ethersproject/providers";
import { maxApprove } from "@/Wallet";
import { ERC20__factory, ZapsUCrvClaim__factory } from "@/Contracts";
import { UnionCrvVaultAddress, ZapsUCrvClaimAddress } from "@/Util/Addresses";
import { type Airdrop, type ZapClaim, type Swap } from "@Pounders/Models";

import logoAirforce from "@/Assets/Icons/Tokens/airforce.png";
import logoCRV from "@/Assets/Icons/Tokens/crv.svg";

// eslint-disable-next-line max-lines-per-function
export function uCrvClaimZaps(
  getSigner: () => JsonRpcSigner | undefined,
  getAddress: () => string | undefined,
  getAirdrop: () => Airdrop | null
): (ZapClaim | Swap)[] {
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

  const extraZapFactory = async (zapAddress: string) => {
    const address = getAddress();
    const airdrop = getAirdrop();
    const signer = getSigner();

    if (!address || !airdrop || !signer) {
      throw new Error("Unable to construct extra claim zaps");
    }

    const utkn = ERC20__factory.connect(UnionCrvVaultAddress, signer);
    await maxApprove(utkn, address, zapAddress, airdrop.amount);

    return {
      extraZaps: ZapsUCrvClaim__factory.connect(zapAddress, signer),
      address,
      amount: airdrop.amount,
      claim: airdrop.claim,
    };
  };

  const claimAsCvxCrv = async () => {
    const x = await extraZapFactory(ZapsUCrvClaimAddress);
    const ps = [
      x.claim.index,
      x.address,
      x.amount,
      x.claim.proof,
      x.address,
    ] as const;

    const estimate = await x.extraZaps.estimateGas[
      "claimFromDistributorAsUnderlying(uint256,address,uint256,bytes32[],address)"
    ](...ps);

    const tx = await x.extraZaps[
      "claimFromDistributorAsUnderlying(uint256,address,uint256,bytes32[],address)"
    ](...ps, {
      gasLimit: estimate.mul(125).div(100),
    });

    return tx.wait();
  };

  // Zaps
  const ucrv: ZapClaim = {
    logo: logoAirforce,
    label: "uCRV",
    withdrawSymbol: "uCRV",
    withdrawDecimals: () => Promise.resolve(18n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: () => claim(),
  };

  const cvxcrv: ZapClaim = {
    logo: logoCRV,
    label: "cvxCRV",
    withdrawSymbol: "cvxCRV",
    withdrawDecimals: () => Promise.resolve(18n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: () => claimAsCvxCrv(),
  };

  const swap: Swap = {
    buy: "ETH",
    sell: "cvxCRV",
  };

  const options = [ucrv, cvxcrv, swap];

  return options;
}
