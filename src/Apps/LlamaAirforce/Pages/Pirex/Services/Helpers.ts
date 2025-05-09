import { type Address, formatUnits } from "viem";
import type { Price } from "@/Services";
import type {
  Reward,
  SnapshotReward,
  FuturesReward,
  RewardSnapshot,
  RewardFutures,
} from "@LAF/Pages/Pirex/Services";

function calculateRewards(
  rewards: (SnapshotReward | FuturesReward)[],
  prices: Record<Address, Price | undefined>,
  type: "snapshot" | "futures"
): Reward[] {
  return rewards
    .groupBy((x) => x.address)
    .entries()
    .map(([, group]) => ({
      address: group[0].address,
      amount: group.reduce((sum, { rewardAmount }) => sum + rewardAmount, 0n),
      metadata: group.map((x) =>
        type === "snapshot"
          ? { epoch: x.epoch, rewardIndex: (x as SnapshotReward).rewardIndex }
          : x.epoch
      ),
    }))
    .map(({ address, amount, metadata }) => {
      const priceInfo = prices[address];
      if (!priceInfo) {
        return {
          type,
          symbol: "?",
          address,
          amount: 0,
          amountUsd: 0,
          [type === "snapshot" ? "claims" : "epochs"]: [],
        } as Reward;
      }

      const { symbol, decimals, price } = priceInfo;
      const formattedAmount = Number(formatUnits(amount, decimals));
      const amountUsd = formattedAmount * price;

      return {
        type,
        symbol: symbol.toLocaleUpperCase(),
        address,
        amount: formattedAmount,
        amountUsd,
        [type === "snapshot" ? "claims" : "epochs"]: metadata,
      };
    });
}

export const calculateSnapshotRewards = (
  snapshots: SnapshotReward[],
  prices: Record<Address, Price | undefined>
) =>
  calculateRewards(
    snapshots.filter(({ isClaimed }) => !isClaimed),
    prices,
    "snapshot"
  ) as RewardSnapshot[];

export const calculateFuturesRewards = (
  futures: FuturesReward[],
  prices: Record<Address, Price | undefined>
) => calculateRewards(futures, prices, "futures") as RewardFutures[];

export function sumRewards(
  snapshotRewards: Reward[],
  futuresRewards: Reward[]
): Reward[] {
  return snapshotRewards
    .concat(futuresRewards)
    .groupBy((reward) => reward.address)
    .entries()
    .map(([, group]) => {
      const first = group[0];

      return {
        type: "combined" as const,
        symbol: first.symbol,
        address: first.address,
        amount: group.reduce((sum, { amount }) => sum + amount, 0),
        amountUsd: group.reduce((sum, { amountUsd }) => sum + amountUsd, 0),
      };
    });
}
