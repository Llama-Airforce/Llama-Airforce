import type { Chain } from "@CM/Services";
import * as Api from "@CM/Services/lending";

export function useQueryLoanDistribution(
  endpoint: Ref<Api.Endpoint>,
  controller: Ref<string | undefined>,
  chain: Ref<Chain | undefined>
) {
  return useQuery({
    queryKey: ["lending-loan-distribution", controller] as const,
    queryFn: ({ queryKey: [, controller] }) =>
      Api.getLoanDistribution(endpoint.value, chain.value!, controller!),
    initialData: {
      stablecoin: [],
      debt: [],
      collateral: [],
    },
    initialDataUpdatedAt: 0,
    enabled: computed(() => !!controller.value && !!chain.value),
  });
}
