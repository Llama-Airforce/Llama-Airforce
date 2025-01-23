import type { Chain } from "..";
import * as Api from "./api";

export function useQueryOHLC(
  chain: Ref<Chain | undefined>,
  poolAddr: Ref<string | undefined>,
  tokenMain: Ref<string | undefined>,
  tokenRef: Ref<string | undefined>
) {
  return useQuery({
    queryKey: ["curve-token-price", poolAddr, tokenMain, tokenRef] as const,
    queryFn: ({ queryKey: [, poolAddr, tokenMain, tokenRef] }) =>
      Api.getOHLC(chain.value!, poolAddr!, tokenMain!, tokenRef!),
    enabled: computed(
      () =>
        !!chain.value &&
        !!poolAddr.value &&
        !!tokenMain.value &&
        !!tokenRef.value
    ),
    initialData: [],
    initialDataUpdatedAt: 0,
  });
}
