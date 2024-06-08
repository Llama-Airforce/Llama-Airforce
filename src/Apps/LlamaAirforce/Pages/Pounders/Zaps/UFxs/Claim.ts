import { type JsonRpcSigner } from "@ethersproject/providers";
import { type Address, type PublicClient, type WalletClient } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import { abi as abiZaps } from "@/ABI/Union/ZapsUFxsClaim";
import { maxApproveViem } from "@/Wallet";
import { DefiLlamaService } from "@/Services";
import { getCvxFxsPriceViem } from "@/Util";
import { UnionFxsVaultAddress, ZapsUFxsClaimAddress } from "@/Util/Addresses";
import type { Airdrop, ZapClaim, Swap } from "@Pounders/Models";
import { calcMinAmountOut } from "@Pounders/Util/MinAmountOutHelper";
import { getUFxsPriceViem } from "@Pounders/Zaps/UFxs/PriceHelper";
import { claim } from "@Pounders/Zaps/Helpers";

import logoAirforce from "@/Assets/Icons/Tokens/airforce.png";
import logoFXS from "@/Assets/Icons/Tokens/fxs.png";

// eslint-disable-next-line max-lines-per-function
export function uFxsClaimZaps(
  getClient: () => PublicClient | undefined,
  getWallet: () => Promise<WalletClient | undefined>,
  getAddress: () => Address | undefined,
  getAirdrop: () => Airdrop | undefined
): (ZapClaim | Swap)[] {
  const claimAsCvxFxs = async (minAmountOut: bigint) => {
    const address = getAddress();
    const airdrop = getAirdrop();
    const client = getClient();
    const wallet = await getWallet();

    if (!address || !airdrop || !client || !wallet?.account) {
      throw new Error("Unable to construct extra claim zaps");
    }

    await maxApproveViem(
      client,
      wallet,
      UnionFxsVaultAddress,
      address,
      ZapsUFxsClaimAddress,
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

    const hash = await wallet.writeContract({
      chain: wallet.chain!,
      account: wallet.account,
      abi: abiZaps,
      address: ZapsUCvxClaimAddress,
      functionName: "claimFromDistributorAsUnderlying",
      args,
    });

    return waitForTransactionReceipt(client, { hash });
  };

  // Zaps
  const ufxs: ZapClaim = {
    logo: logoAirforce,
    label: "uFXS",
    withdrawSymbol: "uFXS",
    withdrawDecimals: () => Promise.resolve(18n),
    claimBalance: () => Promise.resolve(getAirdrop()?.amount ?? 0n),
    zap: () => claim(getClient, getWallet, getAddress, getAirdrop),
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
      client: JsonRpcSigner | PublicClient,
      input: bigint,
      slippage: number
    ): Promise<bigint> => {
      const llamaService = new DefiLlamaService(host);

      const cvxfxs = await getCvxFxsPriceViem(
        llamaService,
        client as PublicClient
      )
        .then((x) => x)
        .catch(() => Infinity);

      const ufxs = await getUFxsPriceViem(llamaService, client as PublicClient);

      return calcMinAmountOut(input, ufxs, cvxfxs, slippage);
    },
  };

  const swap: Swap = {
    buy: "ETH",
    sell: "cvxFXS",
  };

  const options = [ufxs, cvxFXS, swap];

  return options;
}
