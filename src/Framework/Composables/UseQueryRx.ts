import type { Observable, Subscription } from "rxjs";

/** Options for useQueryRx function */
type UseQueryRxOptions<T, U = T> = {
  /** Unique key for identifying and caching the query */
  queryKey: Ref<readonly unknown[]>;

  /** Function to trigger a (re)fetch of (initial) data. */
  queryFn: () => void;

  /** Controls whether the query should execute */
  enabled: Ref<boolean>;

  /**
   * RxJS Observable for real-time updates.
   * Whenever the observable changes, the composable will unsubscribe
   * it's current subscription and resubscribe to the new observable.
   */
  observable: Ref<Observable<T> | undefined>;

  /** Function to merge new data with existing query data */
  setQueryData: (oldData: U | undefined, data: T) => U;

  /**
   * Optional duration (in ms) before data is considered stale
   * Set to Infinity if you never want it to be stale and refetched,
   * which is the case if the observable is a never ending stream.
   */
  staleTime?: number;
};

/**
 * Combines Vue Query with RxJS Observables for reactive data fetching and updates.
 *
 * This composable enhances Vue Query by integrating RxJS Observables, allowing for:
 * 1. Initial data fetching via Vue Query's mechanisms.
 * 2. Subsequent real-time updates through RxJS Observables.
 * 3. Automatic query cache updates when new data arrives.
 *
 * It's particularly useful for scenarios requiring both initial data load and live updates,
 * such as WebSocket connections or other streaming data sources.
 *
 * @template T The type of data emitted by the Observable
 * @template U The type of data stored in the query cache
 * @param options Configuration options for the query and Observable
 * @returns A Vue Query result object with real-time update capabilities
 *
 * @example
 * const transfersService = ref(new TransfersService(socket));
 * const { data, isFetching: loading } = useQueryRx({
 *   queryKey: computed(() => ["transfers", url.value] as const),
 *   queryFn: () => transfersService.value?.subTransfers(),
 *   enabled: computed(() => !!socket),
 *   observable: computed(() => transfersService.value.transfers$),
 *   setQueryData: (oldData, newData) => [...(oldData || []), ...newData],
 *   staleTime: Infinity
 * });
 */
export function useQueryRx<T, U = T>({
  queryKey,
  queryFn,
  enabled,
  observable,
  setQueryData,
  staleTime,
}: UseQueryRxOptions<T, U>) {
  const queryClient = useQueryClient();

  let subscription: Subscription | null = null;

  const query = useQuery({
    queryKey,
    queryFn: () =>
      // This promise won't resolve until the subscription receives its first data.
      new Promise<U>((resolve, reject) => {
        // Unsubscribe any previous to prevent leaks.
        subscription?.unsubscribe();

        subscription = observable.value!.subscribe({
          next: (data: T) => {
            const oldData = queryClient.getQueryData<U | undefined>(queryKey);

            const newData = setQueryData(oldData, data);
            queryClient.setQueryData(queryKey.value, newData);
            resolve(newData);
          },
          error: (error: unknown) => {
            reject(error instanceof Error ? error : new Error(String(error)));
          },
        });

        queryFn();
      }),
    enabled: computed(() => enabled.value && !!observable.value),
    // Staletime being set as undefined is different from not setting it at all.
    ...(staleTime !== undefined ? { staleTime } : {}),
  });

  /*
   * Invalidate query whenever observable or enabled changes.
   * Unsubscribe from the current subscription to prevent
   * listening to no observables or when disabled.
   */
  watch([enabled, observable], async () => {
    if (!enabled.value || !observable.value) {
      subscription?.unsubscribe();
    }

    queryClient.setQueryData(queryKey.value, null);
    await queryClient.invalidateQueries({ queryKey });
  });

  onUnmounted(() => subscription?.unsubscribe());

  return query;
}
