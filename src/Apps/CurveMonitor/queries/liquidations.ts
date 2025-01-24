import type { Chain } from "@CM/Services";
import * as Api from "@CM/Services/liquidations";

function initEmptyArray() {
  return {
    initialData: [],
    initialDataUpdatedAt: 0,
  };
}

function hasMarket(
  market: Ref<string | undefined>,
  chain?: Ref<Chain | undefined>
) {
  return {
    enabled: computed(() => !!market.value && (chain ? !!chain.value : true)),
  };
}

export function useQuerySoftLiqRatios(
  endpoint: Ref<Api.Endpoint>,
  chain: Ref<Chain | undefined>,
  market: Ref<string | undefined>
) {
  return useQuery({
    queryKey: ["liqs-soft-liqs", market] as const,
    queryFn: ({ queryKey: [, market] }) =>
      Api.getSoftLiqRatios(endpoint.value, chain.value!, market!),
    ...hasMarket(market, chain),
    ...initEmptyArray(),
  });
}
export function useQueryLiqsDetailed(
  endpoint: Ref<Api.Endpoint>,
  chain: Ref<Chain | undefined>,
  market: Ref<string | undefined>
) {
  return useQuery({
    queryKey: ["liqs-detailed", market] as const,
    queryFn: ({ queryKey: [, market] }) =>
      Api.getLiqsDetailed(endpoint.value, chain.value!, market!),
    ...hasMarket(market, chain),
    ...initEmptyArray(),
  });
}

export function useQueryLiqsAggregate(
  endpoint: Ref<Api.Endpoint>,
  chain: Ref<Chain | undefined>,
  market: Ref<string | undefined>
) {
  return useQuery({
    queryKey: ["liqs-aggregate", market] as const,
    queryFn: ({ queryKey: [, market] }) =>
      Api.getLiqsAggregate(endpoint.value, chain.value!, market!),
    ...hasMarket(market, chain),
    ...initEmptyArray(),
  });
}

export function useQueryLiqOverview(
  endpoint: Ref<Api.Endpoint>,
  chain: Ref<Chain | undefined>,
  market: Ref<string | undefined>
) {
  return useQuery({
    queryKey: ["liqs-overview", market] as const,
    queryFn: ({ queryKey: [, market] }) =>
      Api.getLiqOverview(endpoint.value, chain.value!, market!),
    ...hasMarket(market, chain),
  });
}

export function useQueryLiqLosses(
  endpoint: Ref<Api.Endpoint>,
  chain: Ref<Chain | undefined>,
  market: Ref<string | undefined>
) {
  return useQuery({
    queryKey: ["liqs-losses", market] as const,
    queryFn: ({ queryKey: [, market] }) =>
      Api.getLiqLosses(endpoint.value, chain.value!, market!),
    ...hasMarket(market, chain),
    ...initEmptyArray(),
  });
}

export function useQueryLiqHealthDeciles(
  endpoint: Ref<Api.Endpoint>,
  chain: Ref<Chain | undefined>,
  market: Ref<string | undefined>
) {
  return useQuery({
    queryKey: ["liqs-health-deciles", market] as const,
    queryFn: ({ queryKey: [, market] }) =>
      Api.getLiqHealthDeciles(endpoint.value, chain.value!, market!),
    ...hasMarket(market, chain),
    ...initEmptyArray(),
  });
}
