import { keepPreviousData } from "@tanstack/vue-query";
import LlammaService, { type Endpoint } from "@CM/Services/Llamma";
import { type Chain } from "@CM/Models/Chain";

const service = new LlammaService();

export function useQueryEvents(
  endpoint: Ref<Endpoint>,
  llamma: Ref<string | undefined>,
  chain: Ref<Chain | undefined>,
  page: Ref<number>
) {
  return useQuery({
    queryKey: ["llamma-market-events", llamma, page] as const,
    queryFn: ({ queryKey: [, llamma, page] }) =>
      service.getEvents(endpoint.value, chain.value!, llamma!, page),
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
      service.getTrades(endpoint.value, chain.value!, llamma!, page),
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
      service.getOHLC(endpoint.value, chain.value!, llamma!),
    enabled: computed(() => !!llamma.value && !!chain.value),
  });
}
