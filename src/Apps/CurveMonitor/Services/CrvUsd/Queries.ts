import CrvUsdService, { type Market } from "@CM/Services/CrvUsd";

const crvUsdService = new CrvUsdService(getHost());

function useMarketAddress(market: Ref<Market | undefined>) {
  return computed(() => market.value?.address);
}

function initEmptyArray() {
  return {
    initialData: [],
    initialDataUpdatedAt: 0,
  };
}

function hasMarket(market: Ref<Market | undefined>) {
  return { enabled: computed(() => !!market.value) };
}

export function useQueryCrvUsdSupply() {
  return useQuery({
    queryKey: ["crvusd-supply"],
    queryFn: () => crvUsdService.getCrvUsdSupply(),
    ...initEmptyArray(),
  });
}

export function useQueryLiqAvgHealth(market: Ref<Market | undefined>) {
  return useQuery({
    queryKey: ["crvusd-liq-average-health", useMarketAddress(market)] as const,
    queryFn: ({ queryKey: [, market] }) =>
      crvUsdService.getHistoricalAverageHealth(market!),
    ...hasMarket(market),
    ...initEmptyArray(),
  });
}

export function useQueryPriceDeviation() {
  return useQuery({
    queryKey: ["crvusd-price-deviation"],
    queryFn: () => crvUsdService.getCrvUsdPriceHistogram(),
    initialData: { x: [], y: [] },
    initialDataUpdatedAt: 0,
  });
}

export function useQueryMarketHealth(market: Ref<Market | undefined>) {
  return useQuery({
    queryKey: ["crvusd-liq-market-health", useMarketAddress(market)] as const,
    queryFn: ({ queryKey: [, market] }) =>
      crvUsdService.getMarketStateHealth(market!),
    ...hasMarket(market),
  });
}

export function useQueryLiqColRatio(market: Ref<Market | undefined>) {
  return useQuery({
    queryKey: [
      "crvusd-liq-collateral-ratio",
      useMarketAddress(market),
    ] as const,
    queryFn: ({ queryKey: [, market] }) =>
      crvUsdService.getHistoricalCollateralRatio(market!),
    ...hasMarket(market),
    ...initEmptyArray(),
  });
}

export function useQueryLiqHealthDeciles(market: Ref<Market | undefined>) {
  return useQuery({
    queryKey: ["crvusd-liq-health-deciles", useMarketAddress(market)] as const,
    queryFn: ({ queryKey: [, market] }) =>
      crvUsdService.getHealthDeciles(market!),
    ...hasMarket(market),
    ...initEmptyArray(),
  });
}

export function useQueryLiquidations(market: Ref<Market | undefined>) {
  return useQuery({
    queryKey: ["crvusd-liq-historical", useMarketAddress(market)] as const,
    queryFn: ({ queryKey: [, market] }) =>
      crvUsdService.getHistoricalLiquidations(market!),
    ...hasMarket(market),
    ...initEmptyArray(),
  });
}

export function useQueryLiquidatorRevenue(market: Ref<Market | undefined>) {
  return useQuery({
    queryKey: ["crvusd-liq-revenue", useMarketAddress(market)] as const,
    queryFn: ({ queryKey: [, market] }) =>
      crvUsdService.getLiquidatorRevenue(market!),
    ...hasMarket(market),
    ...initEmptyArray(),
  });
}

export function useQueryMedianLoss(market: Ref<Market | undefined>) {
  return useQuery({
    queryKey: ["crvusd-liq-median-losses", useMarketAddress(market)] as const,
    queryFn: ({ queryKey: [, market] }) =>
      crvUsdService.getHistoricalMedianLoss(market!),
    ...hasMarket(market),
    ...initEmptyArray(),
  });
}

export function useQueryProportionLosers(market: Ref<Market | undefined>) {
  return useQuery({
    queryKey: [
      "crvusd-liq-proportion-losers",
      useMarketAddress(market),
    ] as const,
    queryFn: ({ queryKey: [, market] }) =>
      crvUsdService.getProportionLosers(market!),
    ...hasMarket(market),
    ...initEmptyArray(),
  });
}

export function useQueryLiqsSoft(market: Ref<Market | undefined>) {
  return useQuery({
    queryKey: ["crvusd-liq-soft-liqs", useMarketAddress(market)] as const,
    queryFn: ({ queryKey: [, market] }) =>
      crvUsdService.getHistoricalSoftLiquidations(market!),
    ...hasMarket(market),
    ...initEmptyArray(),
  });
}

export function useQueryAvailableCap(market: Ref<Market | undefined>) {
  return useQuery({
    queryKey: ["crvusd-liq-available-cap", useMarketAddress(market)] as const,
    queryFn: ({ queryKey: [, market] }) =>
      crvUsdService.getMarketAvailableCap(market!),
    ...hasMarket(market),
    ...initEmptyArray(),
  });
}

export function useQuerySnapshots(market: Ref<Market | undefined>) {
  return useQuery({
    queryKey: ["crvusd-market-snapshots", useMarketAddress(market)] as const,
    queryFn: ({ queryKey: [, market] }) =>
      crvUsdService.getSnapshots("ethereum", market!),
    ...hasMarket(market),
    ...initEmptyArray(),
  });
}

export function useQueryVolume(market: Ref<Market | undefined>) {
  return useQuery({
    queryKey: ["crvusd-market-volume", useMarketAddress(market)] as const,
    queryFn: ({ queryKey: [, market] }) => crvUsdService.getVolume(market!),
    ...hasMarket(market),
    ...initEmptyArray(),
  });
}

export function useQueryPoolPrices() {
  return useQuery({
    queryKey: ["crvusd-pool-prices"],
    queryFn: () => crvUsdService.getPoolPrices(),
    initialData: [{ timestamp: 0 }],
    initialDataUpdatedAt: 0,
  });
}

export function useQueryLiquidators(market: Ref<Market | undefined>) {
  return useQuery({
    queryKey: ["crvusd-liq-liquidators", useMarketAddress(market)] as const,
    queryFn: ({ queryKey: [, market] }) =>
      crvUsdService.getTopLiquidators(market!),
    ...hasMarket(market),
    ...initEmptyArray(),
  });
}

export function useQueryMarkets() {
  return useQuery({
    queryKey: ["crvusd-markets"],
    queryFn: () => crvUsdService.getMarkets("ethereum", 1),
    ...initEmptyArray(),
  });
}

export function useQueryFees() {
  return useQuery({
    queryKey: ["crvusd-fees"],
    queryFn: () => crvUsdService.getFeesBreakdown(),
    initialData: { pending: [], collected: [] },
    initialDataUpdatedAt: 0,
  });
}

export function useQueryYields() {
  return useQuery({
    queryKey: ["crvusd-yields"],
    queryFn: () => crvUsdService.getYield(),
    ...initEmptyArray(),
  });
}

export function useQueryPoolStats() {
  return useQuery({
    queryKey: ["crvusd-pool-stats"],
    queryFn: () => crvUsdService.getPoolStats(),
    ...initEmptyArray(),
  });
}

export function useQueryKeepers() {
  return useQuery({
    queryKey: ["crvusd-keepers"],
    queryFn: () => crvUsdService.getKeepers("ethereum"),
    ...initEmptyArray(),
  });
}