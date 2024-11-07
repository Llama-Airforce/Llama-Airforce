import type { Chain } from "@/Framework/Chain";
import { type Market } from "./Models";
import LlamaLendService from "./LlamaLendService";

const service = new LlamaLendService();

function initEmptyArray() {
  return {
    initialData: [],
    initialDataUpdatedAt: 0,
  };
}

export function useQueryChains() {
  return useQuery({
    queryKey: ["llamalend-chains"] as const,
    queryFn: () => service.getChains(),
    initialData: ["ethereum", "arbitrum"] as Chain[],
    initialDataUpdatedAt: 0,
  });
}

export function useQueryMarkets(chain: Ref<Chain>) {
  return useQuery({
    queryKey: ["llamalend-markets", chain] as const,
    queryFn: ({ queryKey: [, chain] }) => service.getMarkets(chain),
  });
}

export function useQuerySnapshots(
  market: Ref<Market | undefined>,
  chain: Ref<Chain | undefined>
) {
  return useQuery({
    queryKey: [
      "llamalend-market-snapshots",
      computed(() => market.value?.controller),
    ] as const,
    queryFn: ({ queryKey: [, controller] }) =>
      service.getSnapshots(chain.value!, controller!),
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
      "llamalend-user-market-stats",
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
      "llamalend-user-market-snapshots",
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
      "llamalend-user-market-events",
      computed(() => user.value),
      computed(() => chain.value),
      computed(() => market.value),
    ] as const,
    queryFn: ({ queryKey: [, user, chain, market] }) =>
      service.getUserMarketCollateralEvents(user!, chain!, market!),
    enabled: computed(() => !!user.value && !!chain.value && !!market.value),
  });
}
