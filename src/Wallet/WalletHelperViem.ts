import {
  type PublicClient,
  type WalletClient,
  type Address,
  maxUint256,
} from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import { abi as abiERC20 } from "@/ABI/Standards/ERC20";

export async function approveViem(
  client: PublicClient,
  wallet: WalletClient,
  erc20: Address,
  owner: Address,
  spender: Address,
  input: bigint
): Promise<void> {
  const allowance = await client.readContract({
    abi: abiERC20,
    address: erc20,
    functionName: "allowance",
    args: [owner, spender] as const,
  });

  if (allowance < input) {
    // Any previous previous allowance has to be cleared first.
    if (allowance > 0n) {
      const hash = await wallet.writeContract({
        chain: wallet.chain!,
        account: wallet.account!,
        abi: abiERC20,
        address: erc20,
        functionName: "approve",
        args: [spender, 0n] as const,
      });

      await waitForTransactionReceipt(client, { hash });
    }

    const hash = await wallet.writeContract({
      chain: wallet.chain!,
      account: wallet.account!,
      abi: abiERC20,
      address: erc20,
      functionName: "approve",
      args: [spender, input] as const,
    });

    await waitForTransactionReceipt(client, { hash });
  }
}

export async function maxApproveViem(
  client: PublicClient,
  wallet: WalletClient,
  erc20: Address,
  owner: Address,
  spender: Address,
  input: bigint
): Promise<void> {
  const allowance = await client.readContract({
    abi: abiERC20,
    address: erc20,
    functionName: "allowance",
    args: [owner, spender] as const,
  });

  if (allowance < input) {
    // Any previous previous allowance has to be cleared first.
    if (allowance > 0n) {
      const hash = await wallet.writeContract({
        chain: wallet.chain!,
        account: wallet.account!,
        abi: abiERC20,
        address: erc20,
        functionName: "approve",
        args: [spender, 0n] as const,
      });

      await waitForTransactionReceipt(client, { hash });
    }

    const hash = await wallet.writeContract({
      chain: wallet.chain!,
      account: wallet.account!,
      abi: abiERC20,
      address: erc20,
      functionName: "approve",
      args: [spender, maxUint256] as const,
    });

    await waitForTransactionReceipt(client, { hash });
  }
}
