import type { Chain } from "@/Types/Chain";
import * as Api from "./api";

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
      Api.getCushions(chain).then((x) =>
        x.sort((a, b) => b.usdValue - a.usdValue)
      ),
    ...initEmptyArray(),
  });
}

export function useQueryTopPools(chain: Ref<Chain>) {
  return useQuery({
    queryKey: ["curve-revenue-top-pools", chain] as const,
    queryFn: ({ queryKey: [, chain] }) => Api.getTopPools(chain),
    ...initEmptyArray(),
  });
}

export function useQueryRevenueChains() {
  return useQuery({
    queryKey: ["curve-revenue-chain"],
    queryFn: () =>
      Api.getByChain().then((x) =>
        x.sort((a, b) => b.totalDailyFeesUSD - a.totalDailyFeesUSD)
      ),
    ...initEmptyArray(),
  });
}

export function useQueryDistributions() {
  return useQuery({
    queryKey: ["curve-revenue-distributions"],
    queryFn: () => Api.getDistributions(),
    initialData: [],
    initialDataUpdatedAt: 0,
  });
}

export function useQueryCowSwapSettlements() {
  return useQuery({
    queryKey: ["curve-revenue-cow-settlements"],
    queryFn: () => Api.getCowSwapSettlements(),
    ...initEmptyArray(),
  });
}

export function useQueryCrvUsdWeekly() {
  return useQuery({
    queryKey: ["curve-revenue-crvusd-weekly"],
    queryFn: () =>
      Api.getCrvUsdWeekly({
        host: useHost(),
      }),
    ...initEmptyArray(),
  });
}

export function useQueryPoolsWeekly() {
  return useQuery({
    queryKey: ["curve-revenue-pools-weekly"],
    queryFn: () =>
      Api.getPoolsWeekly({
        host: useHost(),
      }),
    ...initEmptyArray(),
  });
}

export function useQueryFeesCollected() {
  return useQuery({
    queryKey: ["curve-revenue-fees-collected"],
    queryFn: () =>
      Api.getFeesCollected({
        host: useHost(),
      }),
    ...initEmptyArray(),
  });
}

export function useQueryFeesStaged() {
  return useQuery({
    queryKey: ["curve-revenue-fees-staged"],
    queryFn: () =>
      Api.getFeesStaged({
        host: useHost(),
      }),
    ...initEmptyArray(),
  });
}
