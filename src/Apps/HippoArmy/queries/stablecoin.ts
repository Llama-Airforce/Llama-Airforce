import type { Chain } from "@curvefi/prices-api";
import * as ApiOhlc from "@curvefi/prices-api/ohlc";
import * as ApiPools from "@curvefi/prices-api/pools";
import { useQuery } from "@tanstack/vue-query";

export function useStableOHLC() {
  return useQuery({
    queryKey: ["reusd-price-history"] as const,
    queryFn: async () => {
      const { start, end } = getTimeRange({ daysRange: 90 });

      const url =
        `https://prices.curve.finance/v1/usd_price` +
        `/ethereum` +
        `/${ReUsdAddress}` +
        `/history?` +
        `interval=day&` +
        `start=${start}&` +
        `end=${end}`;

      const resp = await fetchJson<{
        address: string;
        data: {
          price: number;
          timestamp: string;
        }[];
      }>(url);

      return resp.data.map((x) => ({
        price: x.price,
        timestamp: toDate(x.timestamp),
      }));
    },
    initialData: [],
    initialDataUpdatedAt: 0,
  });
}

export function useOHLC(
  chain: Ref<Chain | undefined>,
  poolAddr: Ref<string | undefined>,
  tokenMain: Ref<string | undefined>,
  tokenRef: Ref<string | undefined>
) {
  return useQuery({
    queryKey: ["curve-token-price", poolAddr, tokenMain, tokenRef] as const,
    queryFn: ({ queryKey: [, poolAddr, tokenMain, tokenRef] }) =>
      ApiOhlc.getOHLC(chain.value!, poolAddr!, tokenMain!, tokenRef!),
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

export function usePool(chain: Ref<Chain | undefined>, poolAddr: string) {
  return useQuery({
    queryKey: ["curve-pool", poolAddr] as const,
    queryFn: async ({ queryKey: [, poolAddr] }) =>
      ApiPools.getPool(chain.value!, poolAddr),
    enabled: computed(() => !!chain.value),
  });
}

export function usePoolVolume(
  chain: Ref<Chain | undefined>,
  poolAddr: Ref<string | undefined>
) {
  return useQuery({
    queryKey: ["curve-pool-volume", poolAddr] as const,
    queryFn: async ({ queryKey: [, poolAddr] }) =>
      ApiPools.getVolume(chain.value!, poolAddr!),
    enabled: computed(() => !!chain.value && !!poolAddr.value),
    initialData: [],
    initialDataUpdatedAt: 0,
  });
}

export function usePoolTvl(
  chain: Ref<Chain | undefined>,
  poolAddr: Ref<string | undefined>
) {
  return useQuery({
    queryKey: ["curve-pool-tvl", poolAddr] as const,
    queryFn: async ({ queryKey: [, poolAddr] }) =>
      ApiPools.getTvl(chain.value!, poolAddr!),
    enabled: computed(() => !!chain.value && !!poolAddr.value),
    initialData: [],
    initialDataUpdatedAt: 0,
  });
}
