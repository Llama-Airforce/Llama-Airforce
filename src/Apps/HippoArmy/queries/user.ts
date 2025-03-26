import type { pagination, timerange } from "../services/schema";
import * as Api from "../services/user";

export function useSnapshots(
  params: MaybeRefOrGetter<
    Omit<
      Parameters<typeof Api.getSnapshots>[0],
      keyof typeof timerange | keyof typeof pagination
    >
  >
) {
  const { start, end } = getTimeRange({ daysRange: 90 });

  return useQuery({
    queryKey: ["user-snapshots", params] as const,
    queryFn: () => {
      const fs = (page: number, per_page: number) =>
        Api.getSnapshots({
          ...toValue(params),
          page,
          per_page,
          start,
          end,
        }).then((x) => x.snapshots);

      return paginate(fs, 1, 100);
    },
    initialData: [],
    initialDataUpdatedAt: 0,
  });
}

export function usePositions(
  params: MaybeRefOrGetter<Parameters<typeof Api.getPositions>[0]>
) {
  return useQuery({
    queryKey: ["user-positions", params] as const,
    queryFn: () => Api.getPositions(toValue(params)),
  });
}
