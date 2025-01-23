export type GetSolverCompetitionResponse = {
  auctionStartBlock: number;
  auction: {
    orders: string[];
    prices: Record<string, string>;
  };
  solutions: {
    solver: string;
    solverAddress: string;
    score: string;
    ranking: number;
    clearingPrices: Record<string, string>;
    orders: {
      id: string;
      sellAmount: number;
      buyAmount: number;
    }[];
  }[];
};
