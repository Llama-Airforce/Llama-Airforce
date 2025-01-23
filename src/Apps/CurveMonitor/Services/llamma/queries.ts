import { keepPreviousData } from "@tanstack/vue-query";
import type { Chain } from "..";
import type { Endpoint } from "./api";
import * as Api from "./api";

export function useQueryEvents(
  endpoint: Ref<Endpoint>,
  llamma: Ref<string | undefined>,
  chain: Ref<Chain | undefined>,
  page: Ref<number>
) {
  return useQuery({
    queryKey: ["llamma-market-events", llamma, page] as const,
    queryFn: ({ queryKey: [, llamma, page] }) =>
      Api.getEvents(endpoint.value, chain.value!, llamma!, page),
    placeholderData: keepPreviousData,
    enabled: computed(() => !!llamma.value && !!chain.value),
  });
}

export function useQueryTrades(
  endpoint: Ref<Endpoint>,
  llamma: Ref<string | undefined>,
  chain: Ref<Chain | undefined>,
  page: Ref<number>
) {
  return useQuery({
    queryKey: ["llamma-market-trades", llamma, page] as const,
    queryFn: ({ queryKey: [, llamma, page] }) =>
      Api.getTrades(endpoint.value, chain.value!, llamma!, page),
    placeholderData: keepPreviousData,
    enabled: computed(() => !!llamma.value && !!chain.value),
  });
}

export function useQueryOHLC(
  endpoint: Ref<Endpoint>,
  llamma: Ref<string | undefined>,
  chain: Ref<Chain | undefined>
) {
  return useQuery({
    queryKey: ["llamma-market-ohlc", llamma] as const,
    queryFn: ({ queryKey: [, llamma] }) =>
      Api.getOHLC(endpoint.value, chain.value!, llamma!),
    enabled: computed(() => !!llamma.value && !!chain.value),
  });
}
