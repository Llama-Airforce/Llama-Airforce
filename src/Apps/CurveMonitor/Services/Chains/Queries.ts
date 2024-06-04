import ChainsService from "@CM/Services/Chains";
import { type Chain } from "@CM/Models/Chain";

const service = new ChainsService(getHost());

function initEmptyArray() {
  return {
    initialData: [],
    initialDataUpdatedAt: 0,
  };
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
