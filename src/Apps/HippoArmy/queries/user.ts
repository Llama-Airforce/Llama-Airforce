import { z } from "zod/v4";
import { FetchError } from "@/Utils/fetch";
import type {
  pagination,
  pairId,
  timerange,
  userAddress,
} from "../services/schema";
import * as Api from "../services/user";

type OptionalPairId = Partial<{
  [K in keyof typeof pairId]: z.infer<(typeof pairId)[K]>;
}>;

export function useSnapshots(
  params: MaybeRefOrGetter<
    Omit<
      Parameters<typeof Api.getSnapshots>[0],
      keyof typeof timerange | keyof typeof pagination | keyof typeof pairId
    > &
      OptionalPairId
  >
) {
  const { start, end } = getTimeRange({ daysRange: 90 });

  return useQuery({
    queryKey: ["user-snapshots", params] as const,
    queryFn: () => {
      const { pair_id, ...rest } = toValue(params);

      const fs = (page: number, per_page: number) =>
        Api.getSnapshots({
          ...rest,
          pair_id: pair_id!,
          page,
          per_page,
          start,
          end,
        }).then((x) => x.snapshots);

      return paginate(fs, 1, 100);
    },
    enabled: computed(() => toValue(params).pair_id !== undefined),
    initialData: [],
    initialDataUpdatedAt: 0,
  });
}

type OptionalUserAddress = Partial<{
  [K in keyof typeof userAddress]: z.infer<(typeof userAddress)[K]>;
}>;

export function usePositions(
  params: MaybeRefOrGetter<
    Omit<Parameters<typeof Api.getPositions>[0], keyof typeof userAddress> &
      OptionalUserAddress
  >
) {
  return useQuery({
    queryKey: ["user-positions", params] as const,
    queryFn: async () => {
      const { user_address } = toValue(params);

      try {
        // Await is necessary for the catch clause to work.
        return await Api.getPositions({ user_address: user_address! });
      } catch (err) {
        if (err instanceof FetchError) {
          return {
            active: [],
            historical: [],
            totalActive: 0,
            totalHistorical: 0,
          };
        }

        throw err;
      }
    },
    enabled: computed(() => toValue(params).user_address !== undefined),
  });
}
