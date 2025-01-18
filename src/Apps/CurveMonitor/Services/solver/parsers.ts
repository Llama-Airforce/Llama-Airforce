import type { Address } from "@/Types/Address";
import type * as ApiTypes from "./apiTypes";
import type * as Models from "./models";

export const parseSolverCompetition = (
  x: ApiTypes.GetSolverCompetitionResponse
): Models.SolverCompetition => {
  return {
    auctionStartBlock: x.auctionStartBlock,
    orders: x.auction.orders.map((x) => x as Address),
    prices: Object.entries(x.auction.prices).reduce<Record<Address, bigint>>(
      (acc, [key, value]) => {
        acc[key as Address] = BigInt(value);
        return acc;
      },
      {}
    ),
    solutions: x.solutions.map((sol) => ({
      solver: sol.solver,
      solverAddress: sol.solverAddress as Address,
      score: BigInt(sol.score),
      ranking: sol.ranking,
      clearingPrices: Object.entries(sol.clearingPrices).reduce<
        Record<Address, bigint>
      >((acc, [key, value]) => {
        acc[key as Address] = BigInt(value);
        return acc;
      }, {}),
      orders: sol.orders.map((order) => ({
        id: order.id as Address,
        sellAmount: BigInt(order.sellAmount),
        buyAmount: BigInt(order.buyAmount),
      })),
    })),
  };
};
