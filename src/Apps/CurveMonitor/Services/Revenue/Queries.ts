import RevenueService from "@CM/Services/Revenue";
import { type Chain } from "@CM/Models/Chain";

const service = new RevenueService(useHost());

function initEmptyArray() {
  return {
    initialData: [],
    initialDataUpdatedAt: 0,
  };
}

export function useQueryCushions() {
  return useQuery({
    queryKey: ["curve-cushions"],
    queryFn: () =>
      service
        .getCushions()
        .then((x) => x.sort((a, b) => b.totalUSD - a.totalUSD)),
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
