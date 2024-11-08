import type { Chain } from "@/Types/Chain";
import LendingService, { type Endpoint } from "./LendingService";

const service = new LendingService();

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
