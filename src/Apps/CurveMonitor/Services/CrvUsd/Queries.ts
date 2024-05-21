import { chain } from "lodash";
import CrvUsdService, { type Market, type Keeper } from "@CM/Services/CrvUsd";
import OHLCService from "@CM/Services/OHLC";

const service = new CrvUsdService(getHost());
const serviceOHLC = new OHLCService(getHost());

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
    queryFn: () => service.getCrvUsdSupply("ethereum"),
    ...initEmptyArray(),
  });
}

export function useQueryLiqAvgHealth(market: Ref<Market | undefined>) {
  return useQuery({
    queryKey: ["crvusd-liq-average-health", useMarketAddress(market)] as const,
    queryFn: ({ queryKey: [, market] }) =>
      service.getHistoricalAverageHealth(market!),
    ...hasMarket(market),
    ...initEmptyArray(),
  });
}

export function useQueryPriceDeviation() {
  return useQuery({
    queryKey: ["crvusd-price-deviation"],
    queryFn: () => service.getCrvUsdPriceHistogram(),
    initialData: { x: [], y: [] },
    initialDataUpdatedAt: 0,
  });
}

export function useQueryMarketHealth(market: Ref<Market | undefined>) {
  return useQuery({
    queryKey: ["crvusd-liq-market-health", useMarketAddress(market)] as const,
    queryFn: ({ queryKey: [, market] }) =>
      service.getMarketStateHealth(market!),
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
      service.getHistoricalCollateralRatio(market!),
    ...hasMarket(market),
    ...initEmptyArray(),
  });
}

export function useQueryLiqHealthDeciles(market: Ref<Market | undefined>) {
  return useQuery({
    queryKey: ["crvusd-liq-health-deciles", useMarketAddress(market)] as const,
    queryFn: ({ queryKey: [, market] }) => service.getHealthDeciles(market!),
    ...hasMarket(market),
    ...initEmptyArray(),
  });
}

export function useQueryLiquidations(market: Ref<Market | undefined>) {
  return useQuery({
    queryKey: ["crvusd-liq-historical", useMarketAddress(market)] as const,
    queryFn: ({ queryKey: [, market] }) =>
      service.getHistoricalLiquidations(market!),
    ...hasMarket(market),
    ...initEmptyArray(),
  });
}

export function useQueryLiquidatorRevenue(market: Ref<Market | undefined>) {
  return useQuery({
    queryKey: ["crvusd-liq-revenue", useMarketAddress(market)] as const,
    queryFn: ({ queryKey: [, market] }) =>
      service.getLiquidatorRevenue(market!),
    ...hasMarket(market),
    ...initEmptyArray(),
  });
}

export function useQueryMedianLoss(market: Ref<Market | undefined>) {
  return useQuery({
    queryKey: ["crvusd-liq-median-losses", useMarketAddress(market)] as const,
    queryFn: ({ queryKey: [, market] }) =>
      service.getHistoricalMedianLoss(market!),
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
    queryFn: ({ queryKey: [, market] }) => service.getProportionLosers(market!),
    ...hasMarket(market),
    ...initEmptyArray(),
  });
}

export function useQueryLiqsSoft(market: Ref<Market | undefined>) {
  return useQuery({
    queryKey: ["crvusd-liq-soft-liqs", useMarketAddress(market)] as const,
    queryFn: ({ queryKey: [, market] }) =>
      service.getHistoricalSoftLiquidations(market!),
    ...hasMarket(market),
    ...initEmptyArray(),
  });
}

export function useQueryAvailableCap(market: Ref<Market | undefined>) {
  return useQuery({
    queryKey: ["crvusd-liq-available-cap", useMarketAddress(market)] as const,
    queryFn: ({ queryKey: [, market] }) =>
      service.getMarketAvailableCap(market!),
    ...hasMarket(market),
    ...initEmptyArray(),
  });
}

export function useQuerySnapshots(market: Ref<Market | undefined>) {
  return useQuery({
    queryKey: ["crvusd-market-snapshots", useMarketAddress(market)] as const,
    queryFn: ({ queryKey: [, market] }) =>
      service.getSnapshots("ethereum", market!),
    ...hasMarket(market),
    ...initEmptyArray(),
  });
}

export function useQueryKeeperPrices(keepers: Ref<Keeper[]>) {
  return useQuery({
    queryKey: [
      "crvusd-keepers-prices",
      computed(() => keepers.value.map((k) => k.pool_address)),
    ] as const,
    queryFn: async () => {
      const promises = keepers.value.map(async (keeper) => {
        const tokenMain = keeper.pair.find((t) => t.symbol !== "crvUSD");
        const tokenRef = keeper.pair.find((t) => t.symbol === "crvUSD");

        if (!tokenMain || !tokenRef) {
          return [];
        }

        const ohlc = await serviceOHLC.getOHLC(
          "ethereum",
          keeper.pool_address,
          tokenMain.address,
          tokenRef.address
        );

        return ohlc.map((x) => ({
          time: x.time,
          price: (x.high + x.low) / 2,
          coin: tokenMain.symbol,
        }));
      });

      const prices = (await Promise.all(promises)).flat();

      const result = chain(prices)
        .groupBy((x) => x.time)
        .map((x, time) => ({
          timestamp: Number(time),
          ...Object.fromEntries(x.map((y) => [y.coin, y.price])),
        }))
        .value();

      return result.length > 0 ? result : [{ timestamp: 0 }];
    },
    initialData: [{ timestamp: 0 }],
    initialDataUpdatedAt: 0,
  });
}

export function useQueryLiquidators(market: Ref<Market | undefined>) {
  return useQuery({
    queryKey: ["crvusd-liq-liquidators", useMarketAddress(market)] as const,
    queryFn: ({ queryKey: [, market] }) => service.getTopLiquidators(market!),
    ...hasMarket(market),
    ...initEmptyArray(),
  });
}

export function useQueryMarkets() {
  return useQuery({
    queryKey: ["crvusd-markets"],
    queryFn: () => service.getMarkets("ethereum", 1),
    ...initEmptyArray(),
  });
}

export function useQueryFees() {
  return useQuery({
    queryKey: ["crvusd-fees"],
    queryFn: () => service.getFeesBreakdown(),
    initialData: { pending: [], collected: [] },
    initialDataUpdatedAt: 0,
  });
}

export function useQueryYields() {
  return useQuery({
    queryKey: ["crvusd-yields"],
    queryFn: () => service.getYield(),
    ...initEmptyArray(),
  });
}

export function useQueryPoolStats() {
  return useQuery({
    queryKey: ["crvusd-pool-stats"],
    queryFn: () => service.getPoolStats(),
    ...initEmptyArray(),
  });
}

export function useQueryKeepers() {
  return useQuery({
    queryKey: ["crvusd-keepers"],
    queryFn: () => service.getKeepers("ethereum"),
    ...initEmptyArray(),
  });
}
