import ProtocolService from "@CM/Services/Protocol";

const protocolService = new ProtocolService(getHost());

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
      protocolService
        .getTvlBreakdownChain()
        .then((x) => x.sort((a, b) => b.tvl - a.tvl)),
    ...initEmptyArray(),
  });
}

export function useQueryTvlGainersLosers() {
  return useQuery({
    queryKey: ["curve-tvl-gainers-losers"],
    queryFn: async () => {
      const gainers_ = protocolService.getTvlGainers();
      const losers_ = protocolService.getTvlLosers();
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
      protocolService
        .getLiquidityTop()
        .then((x) => x.sort((a, b) => b.liq_use - a.liq_use)),
    ...initEmptyArray(),
  });
}

export function useQueryTradesLarge() {
  return useQuery({
    queryKey: ["curve-trades-large"],
    queryFn: () =>
      protocolService
        .getTradesLarge()
        .then((x) => x.sort((a, b) => b.value - a.value))
        .then((x) => x.slice(0, 10)),
    ...initEmptyArray(),
  });
}
