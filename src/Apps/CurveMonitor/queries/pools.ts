import { fetchJson as fetch } from "@/Utils/fetch";
import { getHost, type Chain, type Options } from "@curvefi/prices-api";
import * as Api from "@curvefi/prices-api/pools";
import { useQuery, keepPreviousData } from "@tanstack/vue-query";

export function useQueryPools(chain: Ref<Chain | undefined>) {
  return useQuery({
    queryKey: ["curve-pools", chain] as const,
    queryFn: async ({ queryKey: [, chain] }) => {
      const host = await useHost();
      return Api.getPools(chain!, 1, 9999, {
        host,
      });
    },
    placeholderData: keepPreviousData,
    enabled: computed(() => !!chain.value),
  });
}

export function useQueryPool(chain: Ref<Chain | undefined>, poolAddr: string) {
  return useQuery({
    queryKey: ["curve-pool", poolAddr] as const,
    queryFn: async ({ queryKey: [, poolAddr] }) =>
      Api.getPool(chain.value!, poolAddr),
    enabled: computed(() => !!chain.value),
  });
}

export function useQueryPoolMultiple(
  chain: Ref<Chain | undefined>,
  poolAddrs: Ref<string[]>
) {
  const queries = computed(() =>
    poolAddrs.value.map((poolAddr) => ({
      queryKey: ["curve-pool", poolAddr],
      queryFn: () => Api.getPool(chain.value!, poolAddr),
      enabled: computed(() => !!chain.value),
    }))
  );

  return useQueries({
    queries,
  });
}

export async function getVolume2(
  chain: Chain,
  poolAddr: string,
  daysRange: number,
  options?: Options
) {
  const host = getHost(options);

  const { start, end } = getTimeRange({ daysRange });

  const resp = await fetch<Api.GetVolumeResponse>(
    `${host}/v1/volume/usd/${chain}/${poolAddr}?` +
      `interval=day&` +
      `start=${start}&` +
      `end=${end}`
  );

  return resp.data.map(Api.parseVolume);
}

export function useQueryVolume(
  chain: Ref<Chain | undefined>,
  poolAddr: Ref<string | undefined>,
  days: number | Ref<number> = 90
) {
  const daysValue = computed(() => unref(days));

  return useQuery({
    queryKey: ["curve-pool-volume", poolAddr, daysValue] as const,
    queryFn: async ({ queryKey: [, poolAddr] }) =>
      getVolume2(chain.value!, poolAddr!, daysValue.value),
    enabled: computed(() => !!chain.value && !!poolAddr.value),
    initialData: [],
    initialDataUpdatedAt: 0,
  });
}

export function useQueryTvl(
  chain: Ref<Chain | undefined>,
  poolAddr: Ref<string | undefined>
) {
  return useQuery({
    queryKey: ["curve-pool-tvl", poolAddr] as const,
    queryFn: async ({ queryKey: [, poolAddr] }) =>
      Api.getTvl(chain.value!, poolAddr!),
    enabled: computed(() => !!chain.value && !!poolAddr.value),
    initialData: [],
    initialDataUpdatedAt: 0,
  });
}

type GetSnapshotsResponse = {
  chain: Chain;
  address: Address;
  data: {
    timestamp: number;
    a: number;
    fee: number;
    admin_fee: number;
    virtual_price: number;
    xcp_profit: number | null;
    xcp_profit_a: number | null;
    base_daily_apr: number;
    base_weekly_apr: number;
    offpeg_fee_multiplier: number | null;
    gamma: number | null;
    mid_fee: number | null;
    out_fee: number | null;
    fee_gamma: number | null;
    allowed_extra_profit: number | null;
    adjustment_step: number | null;
    ma_half_time: number | null;
    price_scale: number[] | null;
    price_oracle: number[] | null;
  }[];
};

export type Snapshot = {
  timestamp: Date;
  a: number;
  fee: number;
  adminFee: number;
  virtualPrice: number;
  xcpProfit?: number;
  xcpProfitA?: number;
  baseDailyApr: number;
  baseWeeklyApr: number;
  offpegFeeMultiplier?: number;
  gamma?: number;
  midFee?: number;
  outFee?: number;
  feeGamma?: number;
  allowedExtraProfit?: number;
  adjustmentStep?: number;
  maHalfTime?: number;
  priceScale: number[];
  priceOracle: number[];
};

export const parseSnapshot = (
  x: GetSnapshotsResponse["data"][number]
): Snapshot => ({
  timestamp: toDate(x.timestamp),
  a: x.a,
  fee: x.fee,
  adminFee: x.admin_fee,
  virtualPrice: x.virtual_price,
  xcpProfit: x.xcp_profit ?? undefined,
  xcpProfitA: x.xcp_profit_a ?? undefined,
  baseDailyApr: x.base_daily_apr,
  baseWeeklyApr: x.base_weekly_apr,
  offpegFeeMultiplier: x.offpeg_fee_multiplier ?? undefined,
  gamma: x.gamma ?? undefined,
  midFee: x.mid_fee ?? undefined,
  outFee: x.out_fee ?? undefined,
  feeGamma: x.fee_gamma ?? undefined,
  allowedExtraProfit: x.allowed_extra_profit ?? undefined,
  adjustmentStep: x.adjustment_step ?? undefined,
  maHalfTime: x.ma_half_time ?? undefined,
  priceScale: [...(x.price_scale ?? [])],
  priceOracle: [...(x.price_oracle ?? [])],
});

export async function getSnapshots(
  chain: Chain,
  poolAddr: string,
  daysRange: number,
  options?: Options
) {
  const host = getHost(options);

  const { start, end } = getTimeRange({ daysRange });

  const resp = await fetch<GetSnapshotsResponse>(
    `${host}/v1/snapshots/${chain}/${poolAddr}?` +
      `start=${start}&` +
      `end=${end}`
  );

  return resp.data.map(parseSnapshot);
}

export function useQuerySnapshots(
  chain: Ref<Chain | undefined>,
  poolAddr: Ref<string | undefined>,
  days: number | Ref<number> = 90
) {
  const daysValue = computed(() => unref(days));

  return useQuery({
    queryKey: ["curve-pool-snapshots", poolAddr, daysValue] as const,
    queryFn: async ({ queryKey: [, poolAddr] }) =>
      getSnapshots(chain.value!, poolAddr!, daysValue.value),
    enabled: computed(() => !!chain.value && !!poolAddr.value),
    initialData: [],
    initialDataUpdatedAt: 0,
  });
}
