import type { Chain } from "@/Types/Chain";
import ChainsService from "./ChainsService";

const service = new ChainsService();

function initEmptyArray() {
  return {
    initialData: [],
    initialDataUpdatedAt: 0,
  };
}

export function useQueryChainsSupported() {
  return useQuery({
    queryKey: ["chains-supported"] as const,
    queryFn: () => service.getSupportedChains(),
    initialData: ["ethereum"] as Chain[],
    initialDataUpdatedAt: 0,
  });
}

export function useQueryChainInfo(chain: Ref<Chain | undefined>) {
  return useQuery({
    queryKey: ["chain-info", chain] as const,
    queryFn: ({ queryKey: [, chain] }) => service.getChainInfo(chain!),
    enabled: computed(() => !!chain.value),
  });
}

export function useQueryTxs() {
  return useQuery({
    queryKey: ["chains-txs"] as const,
    queryFn: () => service.getTxs(),
    ...initEmptyArray(),
  });
}

export function useQueryUsers() {
  return useQuery({
    queryKey: ["chains-users"] as const,
    queryFn: () => service.getUsers(),
    ...initEmptyArray(),
  });
}
