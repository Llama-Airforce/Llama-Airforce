import { type Address, formatUnits } from "viem";
import { chain } from "lodash";
import { type Price } from "@/Services";
import type {
  Reward,
  SnapshotReward,
  FuturesReward,
} from "@LAF/Pages/Pirex/Services";

export function calculateSnapshotRewards(
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
          type: "snapshot" as const,
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
        type: "snapshot" as const,
        symbol: symbol.toLocaleUpperCase(),
        address,
        amount: Number(formattedAmount),
        amountUsd,
        claims,
      };
    })
    .value();
}

export function calculateFuturesRewards(
  futures: FuturesReward[],
  prices: Record<Address, Price | undefined>
): Reward[] {
  if (!prices) {
    return [];
  }

  return chain(futures)
    .groupBy((x) => x.address)
    .mapValues((group) => {
      return {
        address: group[0].address,
        amount: group.reduce((sum, { rewardAmount }) => sum + rewardAmount, 0n),
        epochs: group.map((x) => ({
          epoch: x.epoch,
        })),
      };
    })
    .map(({ address, amount, epochs }) => {
      const priceInfo = prices[address];
      if (!priceInfo) {
        return {
          type: "futures" as const,
          symbol: "?",
          address,
          amount: 0,
          amountUsd: 0,
          epochs: [],
        };
      }

      const { symbol, decimals, price } = priceInfo;
      const formattedAmount = formatUnits(amount, decimals);
      const amountUsd = Number(formattedAmount) * price;

      return {
        type: "futures" as const,
        symbol: symbol.toLocaleUpperCase(),
        address,
        amount: Number(formattedAmount),
        amountUsd,
        epochs,
      };
    })
    .value();
}

export function sumRewards(
  snapshotRewards: Reward[],
  futuresRewards: Reward[]
): Reward[] {
  return chain(snapshotRewards)
    .concat(futuresRewards)
    .groupBy((reward) => reward.address)
    .map((group) => {
      const first = group[0];

      return {
        type: "combined" as const,
        symbol: first.symbol,
        address: first.address,
        amount: group.reduce((sum, { amount }) => sum + amount, 0),
        amountUsd: group.reduce((sum, { amountUsd }) => sum + amountUsd, 0),
      };
    })
    .value();
}
