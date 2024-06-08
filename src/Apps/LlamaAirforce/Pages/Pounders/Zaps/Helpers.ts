import { type Address, type PublicClient, type WalletClient } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import { abi as abiMerkle } from "@/ABI/Union/MerkleDistributor2";
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
