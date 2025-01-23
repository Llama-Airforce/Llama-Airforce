import type { Chain } from "..";
import * as Api from "./api";

function initEmptyArray() {
  return {
    initialData: [],
    initialDataUpdatedAt: 0,
  };
}

export function useQueryChainsSupported() {
  return useQuery({
    queryKey: ["chains-supported"] as const,
    queryFn: () => Api.getSupportedChains(),
    initialData: ["ethereum"] as Chain[],
    initialDataUpdatedAt: 0,
  });
}

export function useQueryChainInfo(chain: Ref<Chain | undefined>) {
  return useQuery({
    queryKey: ["chain-info", chain] as const,
    queryFn: ({ queryKey: [, chain] }) => Api.getChainInfo(chain!),
    enabled: computed(() => !!chain.value),
  });
}

export function useQueryTxs() {
  return useQuery({
    queryKey: ["chains-txs"] as const,
    queryFn: () => Api.getTxs(),
    ...initEmptyArray(),
  });
}

export function useQueryUsers() {
  return useQuery({
    queryKey: ["chains-users"] as const,
    queryFn: () => Api.getUsers(),
    ...initEmptyArray(),
  });
}
