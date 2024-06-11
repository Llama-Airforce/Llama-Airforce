import { type Address, type PublicClient, type WalletClient } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import { abi as abiZaps } from "@/ABI/Union/ZapsUCrvClaim";
import { maxApprove } from "@/Wallet";
import { type Airdrop, type ZapClaim, type Swap } from "@Pounders/Models";
import { claim } from "@Pounders/Zaps/Helpers";

import { UnionCrvVaultAddress, ZapsUCrvClaimAddress } from "@/Util/Addresses";

import logoAirforce from "@/Assets/Icons/Tokens/airforce.png";
import logoCRV from "@/Assets/Icons/Tokens/crv.svg";

// eslint-disable-next-line max-lines-per-function
export function uCrvClaimZaps(
  getClient: () => PublicClient | undefined,
  getWallet: () => Promise<WalletClient | undefined>,
  getAddress: () => Address | undefined,
  getAirdrop: () => Airdrop | undefined
): (ZapClaim | Swap)[] {
  const claimAsCvxCrv = async () => {
    const address = getAddress();
    const airdrop = getAirdrop();
    const client = getClient();
    const wallet = await getWallet();

    if (!address || !airdrop || !client || !wallet?.account) {
      throw new Error("Unable to construct extra claim zaps");
    }

    await maxApprove(
      client,
      wallet,
      UnionCrvVaultAddress,
      address,
      ZapsUCrvClaimAddress,
      airdrop.amount
    );

    const args = [
      airdrop.claim.index,
      address,
      airdrop.amount,
      airdrop.claim.proof,
      address,
    ] as const;

    const hash = await wallet.writeContract({
      chain: wallet.chain!,
      account: wallet.account,
      abi: abiZaps,
      address: ZapsUCrvClaimAddress,
      functionName: "claimFromDistributorAsUnderlying",
      args,
    });

    return waitForTransactionReceipt(client, { hash });
  };

  // Zaps
  const ucrv: ZapClaim = {
    logo: logoAirforce,
    label: "uCRV",
    withdrawSymbol: "uCRV",
    withdrawDecimals: () => Promise.resolve(18n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: () => claim(getClient, getWallet, getAddress, getAirdrop),
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
