import { constants } from "ethers";
import { type JsonRpcProvider } from "@ethersproject/providers";
import { type ERC20 } from "@/Contracts";
import { type Network } from "@/Wallet/Network";

export async function isConnected(
  provider?: JsonRpcProvider
): Promise<boolean> {
  if (!provider) {
    return false;
  }

  try {
    const signer = provider.getSigner();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = await signer.getAddress();

    return true;
  } catch {
    return false;
  }
}

export async function getNetwork(
  provider?: JsonRpcProvider
): Promise<Network | undefined> {
  if (!provider) {
    return undefined;
  }

  try {
    const { name, chainId } = await provider.getNetwork();

    if (name === "homestead" && chainId === 1) {
      return "mainnet";
    } else if (chainId === 8453) {
      return "base";
    }

    return undefined;
  } catch {
    return undefined;
  }
}

export async function getAddress(provider: JsonRpcProvider): Promise<string> {
  const signer = provider.getSigner();
  const address = await signer.getAddress();

  return address;
}

export function addressShort(address?: string, digits = 6): string {
  if (!address) {
    return "0x000...000";
  }

  const pre = digits / 2 + 2;
  const post = address.length - digits / 2;

  return `${address.substring(0, pre)}...${address.substring(post)}`;
}

export async function approve(
  erc20: ERC20,
  owner: string,
  spender: string,
  input: bigint
): Promise<void> {
  const allowance = await erc20
    .allowance(owner, spender)
    .then((x) => x.toBigInt());

  if (allowance < input) {
    // Any previous previous allowance has to be cleared first.
    if (allowance > 0n) {
      await erc20.approve(spender, 0).then((x) => x.wait());
    }

    await erc20.approve(spender, input).then((x) => x.wait());
  }
}

export async function maxApprove(
  erc20: ERC20,
  owner: string,
  spender: string,
  input: bigint
): Promise<void> {
  const allowance = await erc20
    .allowance(owner, spender)
    .then((x) => x.toBigInt());

  if (allowance < input) {
    // Any previous previous allowance has to be cleared first.
    if (allowance > 0n) {
      await erc20.approve(spender, 0).then((x) => x.wait());
    }

    await erc20.approve(spender, constants.MaxUint256).then((x) => x.wait());
  }
}
