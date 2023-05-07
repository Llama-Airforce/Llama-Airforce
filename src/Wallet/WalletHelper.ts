import { ERC20 } from "@/Contracts";
import { JsonRpcProvider } from "@ethersproject/providers";
import { constants, BigNumber } from "ethers";

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

export async function isMainnet(provider?: JsonRpcProvider): Promise<boolean> {
  if (!provider) {
    return false;
  }

  try {
    const { name, chainId } = await provider.getNetwork();

    return name === "homestead" && chainId === 1;
  } catch {
    return false;
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
  input: BigNumber
): Promise<void> {
  const allowance = await erc20.allowance(owner, spender);

  if (allowance.lt(input)) {
    await erc20.approve(spender, input).then((x) => x.wait());
  }
}

export async function maxApprove(
  erc20: ERC20,
  owner: string,
  spender: string,
  input: BigNumber
): Promise<void> {
  const allowance = await erc20.allowance(owner, spender);

  if (allowance.lt(input)) {
    await erc20.approve(spender, constants.MaxUint256).then((x) => x.wait());
  }
}
