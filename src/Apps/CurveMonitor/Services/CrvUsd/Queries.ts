import type { Chain } from "@/Types/Chain";
import type { Market, Keeper } from "./Models";
import CrvUsdService from "./CrvUsdService";
import OHLCService from "../OHLC";

const service = new CrvUsdService();
const serviceOHLC = new OHLCService();

function initEmptyArray() {
  return {
    initialData: [],
    initialDataUpdatedAt: 0,
  };
}

export function useQueryCrvUsdSupply() {
  return useQuery({
    queryKey: ["crvusd-supply"],
    queryFn: () => service.getCrvUsdSupply("ethereum"),
    ...initEmptyArray(),
  });
}

export function useQuerySnapshots(market: Ref<Market | undefined>) {
  return useQuery({
    queryKey: [
      "crvusd-market-snapshots",
      computed(() => market.value?.address),
    ] as const,
    queryFn: ({ queryKey: [, market] }) =>
      service.getSnapshots("ethereum", market!),
    enabled: computed(() => !!market.value),
    ...initEmptyArray(),
  });
}

export function useQueryKeeperPrices(keepers: Ref<Keeper[]>) {
  return useQuery({
    queryKey: [
      "crvusd-keepers-prices",
      computed(() => [...new Set(keepers.value.map((k) => k.pool_address))]),
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

      const result = prices
        .groupBy((x) => x.time)
        .entries()
        .map(([time, x]) => ({
          timestamp: Number(time),
          ...Object.fromEntries(x.map((y) => [y.coin, y.price])),
        }));

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

export function useQueryKeepers() {
  return useQuery({
    queryKey: ["crvusd-keepers"],
    queryFn: () => service.getKeepers("ethereum"),
    ...initEmptyArray(),
  });
}

export function useQueryUserMarkets(
  user: Ref<string | undefined>,
  chain: Ref<Chain | undefined>
) {
  return useQuery({
    queryKey: [
      "crvusd-user-markets",
      computed(() => user.value),
      computed(() => chain.value),
    ] as const,
    queryFn: ({ queryKey: [, user, chain] }) =>
      service.getUserMarkets(user!, chain!),
    enabled: computed(() => !!user.value && !!chain.value),
    ...initEmptyArray(),
  });
}

export function useQueryUserMarketStats(
  user: Ref<string | undefined>,
  chain: Ref<Chain | undefined>,
  market: Ref<string | undefined>
) {
  return useQuery({
    queryKey: [
      "crvusd-user-market-stats",
      computed(() => user.value),
      computed(() => chain.value),
      computed(() => market.value),
    ] as const,
    queryFn: ({ queryKey: [, user, chain, market] }) =>
      service.getUserMarketStats(user!, chain!, market!),
    enabled: computed(() => !!user.value && !!chain.value && !!market.value),
  });
}

export function useQueryUserMarketSnapshots(
  user: Ref<string | undefined>,
  chain: Ref<Chain | undefined>,
  market: Ref<string | undefined>
) {
  return useQuery({
    queryKey: [
      "crvusd-user-market-snapshots",
      computed(() => user.value),
      computed(() => chain.value),
      computed(() => market.value),
    ] as const,
    queryFn: ({ queryKey: [, user, chain, market] }) =>
      service.getUserMarketSnapshots(user!, chain!, market!),
    enabled: computed(() => !!user.value && !!chain.value && !!market.value),
    ...initEmptyArray(),
  });
}

export function useQueryUserMarketCollateralEvents(
  user: Ref<string | undefined>,
  chain: Ref<Chain | undefined>,
  market: Ref<string | undefined>
) {
  return useQuery({
    queryKey: [
      "crvusd-user-market-events",
      computed(() => user.value),
      computed(() => chain.value),
      computed(() => market.value),
    ] as const,
    queryFn: ({ queryKey: [, user, chain, market] }) =>
      service.getUserMarketCollateralEvents(user!, chain!, market!),
    enabled: computed(() => !!user.value && !!chain.value && !!market.value),
  });
}
