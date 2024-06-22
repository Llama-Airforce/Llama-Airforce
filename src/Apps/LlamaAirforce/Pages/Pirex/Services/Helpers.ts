import { type Address, formatUnits } from "viem";
import { chain } from "lodash";
import { type Price } from "@/Services";
import { type Reward, type SnapshotReward } from "@LAF/Pages/Pirex/Services";

export function calculateRewards(
  snapshots: SnapshotReward[],
  prices: Record<Address, Price | undefined>
): Reward[] {
  if (!prices) {
    return [];
  }

  return chain(snapshots)
    .filter(({ isClaimed }) => !isClaimed)
    .groupBy((x) => x.address)
    .mapValues((group) => {
      return {
        address: group[0].address,
        amount: group.reduce((sum, { rewardAmount }) => sum + rewardAmount, 0n),
        claims: group.map((x) => ({
          epoch: x.epoch,
          rewardIndex: x.rewardIndex,
        })),
      };
    })
    .map(({ address, amount, claims }) => {
      const priceInfo = prices[address];
      if (!priceInfo) {
        return {
          symbol: "?",
          address,
          amount: 0,
          amountUsd: 0,
          claims: [],
        };
      }

      const { symbol, decimals, price } = priceInfo;
      const formattedAmount = formatUnits(amount, decimals);
      const amountUsd = Number(formattedAmount) * price;

      return {
        symbol: symbol.toLocaleUpperCase(),
        address,
        amount: Number(formattedAmount),
        amountUsd,
        claims,
      };
    })
    .value();
}
