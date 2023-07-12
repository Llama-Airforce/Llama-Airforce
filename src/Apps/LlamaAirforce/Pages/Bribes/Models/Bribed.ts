import { type PoolId } from "@CM/Models";

export type Bribed = {
  pool: PoolId;
  dollarPerVlAsset: number;
  amount: number;
  amountDollars: number;
};

export type BribedPersonal = Bribed & {
  percentage: number; // Range: [0, 100]%.
};

export type VoteDistribution = Record<
  PoolId,
  { vlAsset: number; percentage: number }
>;
