import { type Address, type PublicClient, type WalletClient } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import { abi as abiMerkle } from "@/ABI/Union/MerkleDistributor2";
import { abi as abiERC20 } from "@/ABI/Standards/ERC20";
import { numToBigNumber } from "@/Util";
import type { Airdrop } from "@Pounders/Models";

export async function claim(
  getClient: () => PublicClient | undefined,
  getWallet: () => Promise<WalletClient | undefined>,
  getAddress: () => Address | undefined,
  getAirdrop: () => Airdrop | undefined
) {
  const address = getAddress();
  const airdrop = getAirdrop();
  const client = getClient();
  const wallet = await getWallet();

  if (!airdrop || !address || !client || !wallet?.account) {
    return;
  }

  const args = [
    airdrop.claim.index,
    address,
    airdrop.amount,
    airdrop.claim.proof,
  ] as const;

  const hash = await wallet.writeContract({
    chain: client.chain,
    account: wallet.account,
    abi: abiMerkle,
    address: airdrop.distributorAddress,
    functionName: "claim",
    args,
  });

  return waitForTransactionReceipt(client, { hash });
}

export function getBalance(
  getClient: () => PublicClient | undefined,
  getAddress: () => Address | undefined,
  erc20?: Address
) {
  const address = getAddress();
  const client = getClient();

  if (!address || !client || !erc20) {
    return Promise.resolve(undefined);
  }

  return client.readContract({
    abi: abiERC20,
    address: erc20,
    functionName: "balanceOf",
    args: [address],
  });
}

export function getDecimals(
  getClient: () => PublicClient | undefined,
  erc20?: Address
) {
  const client = getClient();

  if (!client || !erc20) {
    return Promise.resolve(undefined);
  }

  return client
    .readContract({
      abi: abiERC20,
      address: erc20,
      functionName: "decimals",
    })
    .then((x) => BigInt(x));
}

export function calcMinAmountOut(
  input: bigint,
  priceIn: number,
  priceOut: number,
  slippage: number
): bigint {
  const ratio = numToBigNumber((priceIn / priceOut) * (1 - slippage), 24n);
  const dec = 10n ** 24n;
  const minAmountOut = (input * ratio) / dec;

  return minAmountOut;
}
