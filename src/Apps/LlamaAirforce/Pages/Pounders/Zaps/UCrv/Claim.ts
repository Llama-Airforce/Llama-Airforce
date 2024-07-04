import { abi as abiZaps } from "@/ABI/Union/ZapsUCrvClaim";
import { maxApprove } from "@/Wallet";
import { type Airdrop, type ZapClaim } from "@Pounders/Models";
import { claim } from "@Pounders/Zaps/Helpers";

import logoAirforce from "@/Assets/Icons/Tokens/airforce.png";
import logoCRV from "@/Assets/Icons/Tokens/crv.svg";

// eslint-disable-next-line max-lines-per-function
export function uCrvClaimZaps(
  getConfig: () => Config,
  getAddress: () => Address | undefined,
  getAirdrop: () => Airdrop | undefined
): ZapClaim[] {
  const claimAsCvxCrv = async () => {
    const config = getConfig();
    const address = getAddress();
    const airdrop = getAirdrop();

    if (!address || !airdrop) {
      throw new Error("Unable to construct extra claim zaps");
    }

    await maxApprove(
      config,
      UnionCrvVaultAddress,
      address,
      ZapsUCrvClaimAddress,
      airdrop.amount
    );

    const args = [
      BigInt(airdrop.claim.index),
      address,
      airdrop.amount,
      airdrop.claim.proof,
      address,
    ] as const;

    const hash = await writeContract(config, {
      abi: abiZaps,
      address: ZapsUCrvClaimAddress,
      functionName: "claimFromDistributorAsUnderlying",
      args,
    });

    return waitForTransactionReceipt(config, { hash });
  };

  // Zaps
  const ucrv: ZapClaim = {
    logo: logoAirforce,
    label: "uCRV",
    withdrawSymbol: "uCRV",
    withdrawDecimals: () => Promise.resolve(18n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: () => claim(getConfig, getAddress, getAirdrop),
  };

  const cvxcrv: ZapClaim = {
    logo: logoCRV,
    label: "cvxCRV",
    withdrawSymbol: "cvxCRV",
    withdrawDecimals: () => Promise.resolve(18n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: () => claimAsCvxCrv(),
  };

  const options = [ucrv, cvxcrv];

  return options;
}
