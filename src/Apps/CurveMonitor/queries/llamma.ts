import { keepPreviousData } from "@tanstack/vue-query";
import type { Chain, Address } from "@curvefi/prices-api";
import * as Api from "@curvefi/prices-api/llamma";

export function useQueryEvents(
  endpoint: Api.Endpoint,
  llamma: Ref<Address | undefined>,
  chain: Ref<Chain | undefined>,
  page: Ref<number>
) {
  return useQuery({
    queryKey: ["llamma-market-events", llamma, page] as const,
    queryFn: ({ queryKey: [, llamma, page] }) =>
      Api.getEvents({
        endpoint,
        chain: chain.value!,
        llamma: llamma!,
        page: page,
      }),
    placeholderData: keepPreviousData,
    enabled: computed(() => !!llamma.value && !!chain.value),
  });
}

export function useQueryTrades(
  endpoint: Api.Endpoint,
  llamma: Ref<Address | undefined>,
  chain: Ref<Chain | undefined>,
  page: Ref<number>
) {
  return useQuery({
    queryKey: ["llamma-market-trades", llamma, page] as const,
    queryFn: ({ queryKey: [, llamma, page] }) =>
      Api.getTrades({
        endpoint,
        chain: chain.value!,
        llamma: llamma!,
        page,
      }),
    placeholderData: keepPreviousData,
    enabled: computed(() => !!llamma.value && !!chain.value),
  });
}

export function useQueryOHLC(
  endpoint: Api.Endpoint,
  llamma: Ref<Address | undefined>,
  chain: Ref<Chain | undefined>
) {
  return useQuery({
    queryKey: ["llamma-market-ohlc", llamma] as const,
    queryFn: ({ queryKey: [, llamma] }) =>
      Api.getOHLC({
        endpoint,
        chain: chain.value!,
        llamma: llamma!,
      }),
    enabled: computed(() => !!llamma.value && !!chain.value),
  });
}
