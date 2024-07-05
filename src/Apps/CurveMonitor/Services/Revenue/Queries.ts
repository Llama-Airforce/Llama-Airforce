import RevenueService from "@CM/Services/Revenue";
import { type Chain } from "@CM/Models/Chain";

const service = new RevenueService();

function initEmptyArray() {
  return {
    initialData: [],
    initialDataUpdatedAt: 0,
  };
}

export function useQueryCushions(chain: Ref<Chain>) {
  return useQuery({
    queryKey: ["curve-cushions", chain] as const,
    queryFn: ({ queryKey: [, chain] }) =>
      service
        .getCushions(chain)
        .then((x) => x.sort((a, b) => b.usdValue - a.usdValue)),
    ...initEmptyArray(),
  });
}

export function useQueryTopPools(chain: Ref<Chain>) {
  return useQuery({
    queryKey: ["curve-revenue-top-pools", chain] as const,
    queryFn: ({ queryKey: [, chain] }) => service.getTopPools(chain),
    ...initEmptyArray(),
  });
}

export function useQueryRevenueChains() {
  return useQuery({
    queryKey: ["curve-revenue-chain"],
    queryFn: () =>
      service
        .getByChain()
        .then((x) =>
          x.sort((a, b) => b.totalDailyFeesUSD - a.totalDailyFeesUSD)
        ),
    ...initEmptyArray(),
  });
}

export function useQueryRevenueBreakdown() {
  return useQuery({
    queryKey: ["curve-revenue-breakdown"],
    queryFn: () => service.getBreakdown(),
    ...initEmptyArray(),
  });
}

export function useQueryDistributions() {
  return useQuery({
    queryKey: ["curve-revenue-distributions"],
    queryFn: () => service.getDistributions(),
    initialData: [],
    initialDataUpdatedAt: 0,
  });
}

export function useQueryCowSwapSettlements() {
  return useQuery({
    queryKey: ["curve-revenue-cow-settlements"],
    queryFn: () => service.getCowSwapSettlements(),
    ...initEmptyArray(),
  });
}
