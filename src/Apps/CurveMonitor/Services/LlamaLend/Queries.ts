import { keepPreviousData } from "@tanstack/vue-query";
import LlamaLendService, { type Market } from "@CM/Services/LlamaLend";
import { type Chain } from "@CM/Models/Chain";

const service = new LlamaLendService(getHost());

function useController(market: Ref<Market | undefined>) {
  return computed(() => market.value?.controller);
}

function useLlamma(market: Ref<Market | undefined>) {
  return computed(() => market.value?.llamma);
}

function initEmptyArray() {
  return {
    initialData: [],
    initialDataUpdatedAt: 0,
  };
}

export function useQueryChains() {
  return useQuery({
    queryKey: ["llama-markets-chains"] as const,
    queryFn: () => service.getChains(),
    initialData: ["ethereum"] as Chain[],
    initialDataUpdatedAt: 0,
  });
}

export function useQueryMarkets(chain: Ref<Chain>) {
  return useQuery({
    queryKey: ["llama-markets", chain] as const,
    queryFn: ({ queryKey: [, chain] }) => service.getMarkets(chain),
  });
}

export function useQuerySnapshots(
  market: Ref<Market | undefined>,
  chain: Ref<Chain | undefined>
) {
  return useQuery({
    queryKey: ["llama-market-snapshots", useController(market)] as const,
    queryFn: ({ queryKey: [, controller] }) =>
      service.getSnapshots(chain.value!, controller!),
    ...initEmptyArray(),
    enabled: computed(() => !!market.value && !!chain.value),
  });
}

export function useQueryLiqHistory(
  market: Ref<Market | undefined>,
  chain: Ref<Chain | undefined>
) {
  return useQuery({
    queryKey: ["llama-market-liq-history", useController(market)] as const,
    queryFn: ({ queryKey: [, controller] }) =>
      service.getLiqHistory(chain.value!, controller!),
    ...initEmptyArray(),
    enabled: computed(() => !!market.value && !!chain.value),
  });
}

export function useQuerySoftLiqRatios(
  market: Ref<Market | undefined>,
  chain: Ref<Chain | undefined>
) {
  return useQuery({
    queryKey: ["llama-market-softliqs", useController(market)] as const,
    queryFn: ({ queryKey: [, controller] }) =>
      service.getSoftLiqRatios(chain.value!, controller!),
    ...initEmptyArray(),
    enabled: computed(() => !!market.value && !!chain.value),
  });
}

export function useQueryTrades(
  market: Ref<Market | undefined>,
  chain: Ref<Chain | undefined>,
  page: Ref<number>
) {
  return useQuery({
    queryKey: ["llama-market-trades", useLlamma(market), page] as const,
    queryFn: ({ queryKey: [, llamma, page] }) =>
      service.getLlammaTrades(chain.value!, llamma!, page),
    placeholderData: keepPreviousData,
    enabled: computed(() => !!market.value && !!chain.value),
  });
}

export function useQueryOHLC(
  market: Ref<Market | undefined>,
  chain: Ref<Chain | undefined>
) {
  return useQuery({
    queryKey: ["llama-market-ohlc", useLlamma(market)] as const,
    queryFn: ({ queryKey: [, llamma] }) =>
      service.getLlammaOHLC(chain.value!, llamma!),
    enabled: computed(() => !!market.value && !!chain.value),
  });
}
