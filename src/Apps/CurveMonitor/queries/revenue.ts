import type { Chain } from "@curvefi/prices-api";
import * as Api from "@curvefi/prices-api/revenue";

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
    queryFn: async () => {
      const host = await useHost();
      return Api.getCrvUsdWeekly({
        host,
      });
    },
    ...initEmptyArray(),
  });
}

export function useQueryPoolsWeekly() {
  return useQuery({
    queryKey: ["curve-revenue-pools-weekly"],
    queryFn: async () => {
      const host = await useHost();
      return Api.getPoolsWeekly({
        host,
      });
    },
    ...initEmptyArray(),
  });
}

export function useQueryFeesCollected() {
  return useQuery({
    queryKey: ["curve-revenue-fees-collected"],
    queryFn: async () => {
      const host = await useHost();
      return Api.getFeesCollected({
        host,
      });
    },
    ...initEmptyArray(),
  });
}

export function useQueryFeesStaged() {
  return useQuery({
    queryKey: ["curve-revenue-fees-staged"],
    queryFn: async () => {
      const host = await useHost();
      return Api.getFeesStaged({
        host,
      });
    },
    ...initEmptyArray(),
  });
}
