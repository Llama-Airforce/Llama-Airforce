import { chain } from "lodash";
import { type Chain } from "@CM/Models/Chain";
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

function hasMarket(
  market: Ref<Market | undefined>,
  chain?: Ref<Chain | undefined>
) {
  return {
    enabled: computed(() => !!market.value && (chain ? !!chain.value : true)),
  };
}

export function useQueryCrvUsdSupply() {
  return useQuery({
    queryKey: ["crvusd-supply"],
    queryFn: () => service.getCrvUsdSupply("ethereum"),
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

export function useQueryPriceDeviation() {
  return useQuery({
    queryKey: ["crvusd-price-deviation"],
    queryFn: () => service.getCrvUsdPriceHistogram(),
    initialData: { x: [], y: [] },
    initialDataUpdatedAt: 0,
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
