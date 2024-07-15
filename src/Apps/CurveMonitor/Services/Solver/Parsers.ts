import type * as ApiTypes from "@CM/Services/Solver/ApiTypes";
import type * as Models from "@CM/Services/Solver/Models";

export const parseSolverCompetition = (
  x: ApiTypes.GetSolverCompetitionResponse
): Models.SolverCompetition => {
  return {
    auctionStartBlock: x.auctionStartBlock,
    orders: x.auction.orders.map((x) => x as Address),
    prices: Object.entries(x.auction.prices).reduce((acc, [key, value]) => {
      acc[key as Address] = BigInt(value);
      return acc;
    }, {} as Record<Address, bigint>),
    solutions: x.solutions.map((sol) => ({
      solver: sol.solver,
      solverAddress: sol.solverAddress as Address,
      score: BigInt(sol.score),
      ranking: sol.ranking,
      clearingPrices: Object.entries(sol.clearingPrices).reduce(
        (acc, [key, value]) => {
          acc[key as Address] = BigInt(value);
          return acc;
        },
        {} as Record<Address, bigint>
      ),
      orders: sol.orders.map((order) => ({
        id: order.id as Address,
        sellAmount: BigInt(order.sellAmount),
        buyAmount: BigInt(order.buyAmount),
      })),
    })),
  };
};
