type PoolId = string;

export type Bribed = {
  pool: PoolId;
  vlAsset: number;
  dollarPerVlAsset: number;
  amount: number[];
  amountDollars: number[];
  maxPerVote: number[];
};

export type BribedPersonal = Omit<Bribed, "amount" | "amountDollars"> & {
  amount: number;
  amountDollars: number;
  percentage: number; // Range: [0, 100]%.
};

export type VoteDistribution = Record<
  PoolId,
  { vlAsset: number; percentage: number }
>;
