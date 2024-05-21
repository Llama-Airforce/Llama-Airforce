import OHLCService from "@CM/Services/OHLC";
import { type Chain } from "@CM/Models/Chain";

const service = new OHLCService(getHost());

export function useQueryOHLC(
  chain: Ref<Chain>,
  poolAddr: Ref<string>,
  tokenMain: Ref<string>,
  tokenRef: Ref<string>
) {
  return useQuery({
    queryKey: ["curve-token-price", poolAddr, tokenMain, tokenRef] as const,
    queryFn: ({ queryKey: [, poolAddr, tokenMain, tokenRef] }) =>
      service.getOHLC(chain.value, poolAddr, tokenMain, tokenRef),
  });
}
