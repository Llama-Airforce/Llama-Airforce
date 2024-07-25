import { erc20Abi as abiERC20 } from "viem";
import { type Address } from "@/Framework/Address";
import { abi as abiMerkle } from "@/ABI/Union/MerkleDistributor2";
import { numToBigNumber } from "@/Util";
import type { Airdrop } from "@Pounders/Models";

export async function claim(
  getConfig: () => Config,
  getAddress: () => Address | undefined,
  getAirdrop: () => Airdrop | undefined
) {
  const config = getConfig();
  const address = getAddress();
  const airdrop = getAirdrop();

  if (!airdrop || !address) {
    return;
  }

  const args = [
    BigInt(airdrop.claim.index),
    address,
    airdrop.amount,
    airdrop.claim.proof,
  ] as const;

  const hash = await writeContract(config, {
    abi: abiMerkle,
    address: airdrop.distributorAddress,
    functionName: "claim",
    args,
  });

  return waitForTransactionReceipt(config, { hash });
}

export function getBalance(
  getConfig: () => Config,
  getAddress: () => Address | undefined,
  erc20?: Address
) {
  const config = getConfig();
  const address = getAddress();

  if (!address || !erc20) {
    return Promise.resolve(undefined);
  }

  return readContract(config, {
    abi: abiERC20,
    address: erc20,
    functionName: "balanceOf",
    args: [address],
  });
}

export function getDecimals(getConfig: () => Config, erc20?: Address) {
  const config = getConfig();

  if (!erc20) {
    return Promise.resolve(undefined);
  }

  return readContract(config, {
    abi: abiERC20,
    address: erc20,
    functionName: "decimals",
  }).then((x) => BigInt(x));
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
