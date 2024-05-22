import ChainsService from "@CM/Services/Chains";
import { type Chain } from "@CM/Models/Chain";

const service = new ChainsService(getHost());

export function useQueryChainInfo(chain: Ref<Chain | undefined>) {
  return useQuery({
    queryKey: ["curve-chain", chain] as const,
    queryFn: ({ queryKey: [, chain] }) => service.getChainInfo(chain!),
    enabled: computed(() => !!chain.value),
  });
}
