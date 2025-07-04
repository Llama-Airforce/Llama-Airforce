import { fetchJson as fetch } from "@/Utils/fetch";
import { getHost, type Chain, type Options } from "@curvefi/prices-api";
import * as Api from "@curvefi/prices-api/crvusd";
import * as ApiOHLC from "@curvefi/prices-api/ohlc";

function initEmptyArray() {
  return {
    initialData: [],
    initialDataUpdatedAt: 0,
  };
}

export function useQueryCrvUsdSupply(days: number | Ref<number> = 30) {
  const daysValue = computed(() => unref(days));

  return useQuery({
    queryKey: ["crvusd-supply", daysValue] as const,
    queryFn: () => Api.getCrvUsdSupply("ethereum", daysValue.value),
    ...initEmptyArray(),
  });
}

export function useQuerySnapshots(market: Ref<Api.Market | undefined>) {
  return useQuery({
    queryKey: [
      "crvusd-market-snapshots",
      computed(() => market.value?.address),
    ] as const,
    queryFn: ({ queryKey: [, market] }) =>
      Api.getSnapshots("ethereum", market!),
    enabled: computed(() => !!market.value),
    ...initEmptyArray(),
  });
}

export function useQueryKeeperPrices(keepers: Ref<Api.Keeper[]>) {
  return useQuery({
    queryKey: [
      "crvusd-keepers-prices",
      computed(() => [...new Set(keepers.value.map((k) => k.poolAddress))]),
    ] as const,
    queryFn: async () => {
      const promises = keepers.value.map(async (keeper) => {
        const tokenMain = keeper.pair.find((t) => t.symbol !== "crvUSD");
        const tokenRef = keeper.pair.find((t) => t.symbol === "crvUSD");

        if (!tokenMain || !tokenRef) {
          return [];
        }

        const ohlc = await ApiOHLC.getOHLC(
          "ethereum",
          keeper.poolAddress,
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
        .groupBy((x) => x.time.getTime())
        .entries()
        .map(([time, x]) => ({
          timestamp: Number(time) / 1000,
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
    queryFn: () => Api.getMarkets("ethereum", { page: 1 }),
    ...initEmptyArray(),
  });
}

export function useQueryKeepers() {
  return useQuery({
    queryKey: ["crvusd-keepers"],
    queryFn: () => Api.getKeepers("ethereum"),
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
      Api.getUserMarkets(user!, chain!),
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
      Api.getUserMarketStats(user!, chain!, market!),
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
      Api.getUserMarketSnapshots(user!, chain!, market!),
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
      Api.getUserMarketCollateralEvents(user!, chain!, market!),
    enabled: computed(() => !!user.value && !!chain.value && !!market.value),
  });
}

type GetMarketAllUsersResponse = {
  page: number;
  per_page: number;
  count: number;
  data: {
    user: string;
    first: string;
    last: string;
    debt: string;
    health: string;
    health_full: string;
    loss: string;
    stablecoin: string;
    soft_liquidation: boolean;
  }[];
};

export type MarketUser = {
  user: Address;
  first: Date;
  last: Date;
  debt: number;
  health: number;
  healthFull: number;
  loss: number;
  stablecoin: number;
  softLiquidation: boolean;
};

export const parseMarketUsers = (
  x: GetMarketAllUsersResponse["data"][number]
): MarketUser => ({
  user: x.user as Address,
  first: toDate(x.first),
  last: toDate(x.last),
  debt: parseFloat(x.debt),
  health: parseFloat(x.health),
  healthFull: parseFloat(x.health_full),
  loss: parseFloat(x.loss),
  stablecoin: parseFloat(x.stablecoin),
  softLiquidation: x.soft_liquidation,
});

export async function getMarketAllUsers(
  chain: Chain,
  market: string,
  params: {
    page?: number;
    per_page?: number;
  },
  options?: Options
) {
  const host = getHost(options);

  const resp = await fetch<GetMarketAllUsersResponse>(
    `${host}/v1/crvusd/users/${chain}/${market}/users${addQueryString(params)}`
  );

  return resp.data.map(parseMarketUsers);
}

export function useQueryMarketAllUsers(
  chain: Ref<Chain | undefined>,
  market: Ref<string | undefined>
) {
  return useQuery({
    queryKey: [
      "crvusd-market-all-users",
      computed(() => chain.value),
      computed(() => market.value),
    ] as const,
    queryFn: ({ queryKey: [, chain, market] }) =>
      getMarketAllUsers(chain!, market!, { per_page: 1000 }),
    enabled: computed(() => !!chain.value && !!market.value),
  });
}
