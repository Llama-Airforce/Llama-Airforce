import { maxUint256, erc20Abi as abiERC20 } from "viem";
import { type Address } from "@/Framework/Address";

export function addressShort(address?: string, digits = 6): string {
  if (!address) {
    return "0x000...000";
  }

  const pre = digits / 2 + 2;
  const post = address.length - digits / 2;

  return `${address.substring(0, pre)}...${address.substring(post)}`;
}

export async function approve(
  config: Config,
  erc20: Address,
  owner: Address,
  spender: Address,
  input: bigint
): Promise<void> {
  const allowance = await readContract(config, {
    abi: abiERC20,
    address: erc20,
    functionName: "allowance",
    args: [owner, spender] as const,
  });

  if (allowance < input) {
    // Any previous previous allowance has to be cleared first.
    if (allowance > 0n) {
      const hash = await writeContract(config, {
        abi: abiERC20,
        address: erc20,
        functionName: "approve",
        args: [spender, 0n] as const,
      });

      await waitForTransactionReceipt(config, { hash });
    }

    const hash = await writeContract(config, {
      abi: abiERC20,
      address: erc20,
      functionName: "approve",
      args: [spender, input] as const,
    });

    await waitForTransactionReceipt(config, { hash });
  }
}

export async function maxApprove(
  config: Config,
  erc20: Address,
  owner: Address,
  spender: Address,
  input: bigint
): Promise<void> {
  const allowance = await readContract(config, {
    abi: abiERC20,
    address: erc20,
    functionName: "allowance",
    args: [owner, spender] as const,
  });

  if (allowance < input) {
    // Any previous previous allowance has to be cleared first.
    if (allowance > 0n) {
      const hash = await writeContract(config, {
        abi: abiERC20,
        address: erc20,
        functionName: "approve",
        args: [spender, 0n] as const,
      });

      await waitForTransactionReceipt(config, { hash });
    }

    const hash = await writeContract(config, {
      abi: abiERC20,
      address: erc20,
      functionName: "approve",
      args: [spender, maxUint256] as const,
    });

    await waitForTransactionReceipt(config, { hash });
  }
}
