import { bigNumToNumber } from "@/Util";
import { isPirex, type Vault } from "@Pounders/Models/Pounder";

export type Fees = {
  platform: number;
  caller: number;
  withdrawal: number;
};

export async function getFees(utkn: Vault): Promise<Fees> {
  const denominator = bigNumToNumber(
    await utkn.FEE_DENOMINATOR().then((x) => x.toBigInt()),
    1n
  );

  const platform =
    (bigNumToNumber(await utkn.platformFee().then((x) => x.toBigInt()), 1n) /
      denominator) *
    100;

  const withdrawal =
    (bigNumToNumber(
      await utkn.withdrawalPenalty().then((x) => x.toBigInt()),
      1n
    ) /
      denominator) *
    100;

  let caller = 0;
  if (!isPirex(utkn)) {
    caller =
      (bigNumToNumber(
        await utkn.callIncentive().then((x) => x.toBigInt()),
        1n
      ) /
        denominator) *
      100;
  }

  return {
    platform,
    caller,
    withdrawal,
  };
}
