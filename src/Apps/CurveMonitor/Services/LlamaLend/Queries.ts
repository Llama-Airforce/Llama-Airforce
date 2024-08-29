import LlamaLendService, { type Market } from "@CM/Services/LlamaLend";
import { type Chain } from "@CM/Models";

const service = new LlamaLendService();

function useController(market: Ref<Market | undefined>) {
  return computed(() => market.value?.controller);
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
    initialData: ["ethereum", "arbitrum"] as Chain[],
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
