import { numToBigNumber } from "@/Util";

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
