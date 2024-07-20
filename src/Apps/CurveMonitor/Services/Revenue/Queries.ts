import RevenueService from "@CM/Services/Revenue";
import { type Chain } from "@CM/Models";

const service = new RevenueService(useHost());

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

export function useQueryCrvUsdWeekly() {
  return useQuery({
    queryKey: ["curve-revenue-crvusd-weekly"],
    queryFn: () => service.getCrvUsdWeekly(),
    ...initEmptyArray(),
  });
}

export function useQueryPoolsWeekly() {
  return useQuery({
    queryKey: ["curve-revenue-pools-weekly"],
    queryFn: () => service.getPoolsWeekly(),
    ...initEmptyArray(),
  });
}

export function useQueryFeesCollected() {
  return useQuery({
    queryKey: ["curve-revenue-fees-collected"],
    queryFn: () => service.getFeesCollected(),
    ...initEmptyArray(),
  });
}

export function useQueryFeesStaged() {
  return useQuery({
    queryKey: ["curve-revenue-fees-staged"],
    queryFn: () => service.getFeesStaged(),
    ...initEmptyArray(),
  });
}
