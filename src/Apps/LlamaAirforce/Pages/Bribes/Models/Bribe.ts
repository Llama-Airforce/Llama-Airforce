export type Bribe = {
  pool: string;
  gauge?: string;
  token: string;
  amount: number;
  amountDollars: number;
  maxPerVote?: number;
};
