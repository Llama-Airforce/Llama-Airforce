import ProtocolService from "@CM/Services/Protocol";

const service = new ProtocolService();

function initEmptyArray() {
  return {
    initialData: [],
    initialDataUpdatedAt: 0,
  };
}

export function useQueryTvlBreakdown() {
  return useQuery({
    queryKey: ["curve-tvl-breakdown"],
    queryFn: () =>
      service
        .getTvlBreakdownChain()
        .then((x) => x.sort((a, b) => b.tvl - a.tvl)),
    ...initEmptyArray(),
  });
}

export function useQueryTvlGainersLosers() {
  return useQuery({
    queryKey: ["curve-tvl-gainers-losers"],
    queryFn: async () => {
      const gainers_ = service.getTvlGainers();
      const losers_ = service.getTvlLosers();
      const [gainers, losers] = [await gainers_, await losers_];

      return [...gainers, ...losers].sort(
        (a, b) => b.tvl_growth - a.tvl_growth
      );
    },
    ...initEmptyArray(),
  });
}

export function useQueryLiquidityTop() {
  return useQuery({
    queryKey: ["curve-liquidity-top"],
    queryFn: () =>
      service
        .getLiquidityTop()
        .then((x) => x.sort((a, b) => b.liq_use - a.liq_use)),
    ...initEmptyArray(),
  });
}

export function useQueryTradesLarge() {
  return useQuery({
    queryKey: ["curve-trades-large"],
    queryFn: () =>
      service
        .getTradesLarge()
        .then((x) => x.sort((a, b) => b.value - a.value))
        .then((x) => x.slice(0, 10)),
    ...initEmptyArray(),
  });
}
