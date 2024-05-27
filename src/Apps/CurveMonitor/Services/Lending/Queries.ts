import LendingService, { type Endpoint } from "@CM/Services/Lending";
import { type Chain } from "@CM/Models/Chain";

const service = new LendingService(getHost());

export function useQueryLoanDistribution(
  endpoint: Ref<Endpoint>,
  controller: Ref<string | undefined>,
  chain: Ref<Chain | undefined>
) {
  return useQuery({
    queryKey: ["lending-loan-distribution", controller] as const,
    queryFn: ({ queryKey: [, controller] }) =>
      service.getLoanDistribution(endpoint.value, chain.value!, controller!),
    initialData: {
      stablecoin: [],
      debt: [],
      collateral: [],
    },
    initialDataUpdatedAt: 0,
    enabled: computed(() => !!controller.value && !!chain.value),
  });
}
