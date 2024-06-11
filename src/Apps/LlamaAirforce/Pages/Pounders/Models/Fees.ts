import { bigNumToNumber } from "@/Util";
import { isPirex, type Vault } from "@Pounders/Models";

export type Fees = {
  platform: number;
  caller: number;
  withdrawal: number;
};

export async function getFees(utkn: Vault): Promise<Fees> {
  const denominator = bigNumToNumber(await utkn.read.FEE_DENOMINATOR(), 1n);

  const platform =
    (bigNumToNumber(await utkn.read.platformFee(), 1n) / denominator) * 100;

  const withdrawal =
    (bigNumToNumber(await utkn.read.withdrawalPenalty(), 1n) / denominator) *
    100;

  let caller = 0;
  if (!isPirex(utkn)) {
    caller =
      (bigNumToNumber(await utkn.read.callIncentive(), 1n) / denominator) * 100;
  }

  return {
    platform,
    caller,
    withdrawal,
  };
}
