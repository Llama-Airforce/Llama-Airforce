import { fetchJson as fetch } from "@/Utils/fetch";
import {
  getHost,
  type Address,
  type Chain,
  type Options,
} from "@curvefi/prices-api";
import * as Api from "@curvefi/prices-api/llamalend";

function initEmptyArray() {
  return {
    initialData: [],
    initialDataUpdatedAt: 0,
  };
}

export function useQueryChains() {
  return useQuery({
    queryKey: ["llamalend-chains"] as const,
    queryFn: () => Api.getChains(),
    initialData: ["ethereum", "arbitrum"] as Chain[],
    initialDataUpdatedAt: 0,
  });
}

export function useQueryMarkets(chain: Ref<Chain>) {
  return useQuery({
    queryKey: ["llamalend-markets", chain] as const,
    queryFn: ({ queryKey: [, chain] }) => Api.getMarkets(chain),
  });
}

export function useQuerySnapshots(
  market: Ref<Api.Market | undefined>,
  chain: Ref<Chain | undefined>
) {
  return useQuery({
    queryKey: [
      "llamalend-market-snapshots",
      computed(() => market.value?.controller),
    ] as const,
    queryFn: ({ queryKey: [, controller] }) =>
      Api.getSnapshots(chain.value!, controller!),
    ...initEmptyArray(),
    enabled: computed(() => !!market.value && !!chain.value),
  });
}

export function useQueryUserMarkets(
  user: Ref<string | undefined>,
  chain: Ref<Chain | undefined>
) {
  return useQuery({
    queryKey: [
      "llamalend-user-markets",
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
      "llamalend-user-market-stats",
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
      "llamalend-user-market-snapshots",
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
  market: Ref<string | undefined>,
  enabled: Ref<boolean | undefined>
) {
  return useQuery({
    queryKey: [
      "llamalend-user-market-events",
      computed(() => user.value),
      computed(() => chain.value),
      computed(() => market.value),
    ] as const,
    queryFn: ({ queryKey: [, user, chain, market] }) =>
      Api.getUserMarketCollateralEvents(user!, chain!, market!),
    enabled: computed(
      () =>
        !!user.value &&
        !!chain.value &&
        !!market.value &&
        (enabled.value ?? true)
    ),
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
    borrowed: string;
    collateral: string;
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
  borrowed: number;
  collateral: number;
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
  borrowed: parseFloat(x.borrowed),
  collateral: parseFloat(x.collateral),
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
    `${host}/v1/lending/users/${chain}/${market}/users${addQueryString(params)}`
  );

  return resp.data.map(parseMarketUsers);
}

export function useQueryMarketAllUsers(
  chain: Ref<Chain | undefined>,
  market: Ref<string | undefined>
) {
  return useQuery({
    queryKey: [
      "llamalend-market-all-users",
      computed(() => chain.value),
      computed(() => market.value),
    ] as const,
    queryFn: ({ queryKey: [, chain, market] }) =>
      getMarketAllUsers(chain!, market!, { per_page: 1000 }),
    enabled: computed(() => !!chain.value && !!market.value),
  });
}
