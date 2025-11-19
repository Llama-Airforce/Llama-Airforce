import type { Address } from "@/types/address";
import PirexService, {
  type FuturesReward,
  type SnapshotReward,
} from "@LAF/Pages/Pirex/Services";
import { useQuery } from "@tanstack/vue-query";
import { getPirexRewards } from "./PirexRewards";

const service = new PirexService(useHost());

export function useQueryRewards(
  getConfig: () => Config,
  address: Ref<Address | undefined>
) {
  return useQuery({
    queryKey: ["pirex-rewards", address] as const,
    queryFn: async ({ queryKey: [, address] }) => {
      const config = getConfig();

      const snapshotRewards: SnapshotReward[] = [];
      const futuresRewards: FuturesReward[] = [];
      let paginationDone = false;
      let page = 0;

      while (!paginationDone) {
        // eslint-disable-next-line no-await-in-loop
        const result = await getPirexRewards(config, address!, page);
        snapshotRewards.push(...result.snapshotRewards);
        futuresRewards.push(...result.futuresRewards);
        paginationDone = result.paginationDone;
        page++;
      }

      return { snapshotRewards, futuresRewards };
    },
    initialData: {
      snapshotRewards: [],
      futuresRewards: [],
    },
    initialDataUpdatedAt: 0,
    enabled: computed(() => !!address.value),
    retry: false, // A hefty computation that might take a while, no need to retry when it's still busy
  });
}

export function useQueryRedemptions(address: Ref<Address | undefined>) {
  return useQuery({
    queryKey: ["pirex-redemptions", address] as const,
    queryFn: async ({ queryKey: [, address] }) =>
      service.getRedemptions(address!),
    initialData: [],
    initialDataUpdatedAt: 0,
    enabled: computed(() => !!address.value),
  });
}

export function useQueryFutures(address: Ref<Address | undefined>) {
  return useQuery({
    queryKey: ["pirex-futures", address] as const,
    queryFn: async ({ queryKey: [, address] }) => service.getFutures(address!),
    initialData: [],
    initialDataUpdatedAt: 0,
    enabled: computed(() => !!address.value),
  });
}
