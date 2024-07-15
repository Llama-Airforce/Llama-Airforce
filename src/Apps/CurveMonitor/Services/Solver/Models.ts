import { type Address } from "viem";

export type SolverCompetition = {
  auctionStartBlock: number;
  orders: Address[];
  prices: Record<Address, bigint>;
  solutions: {
    solver: string;
    solverAddress: Address;
    score: bigint;
    ranking: number;
    clearingPrices: Record<Address, bigint>;
    orders: {
      id: Address;
      sellAmount: bigint;
      buyAmount: bigint;
    }[];
  }[];
};
