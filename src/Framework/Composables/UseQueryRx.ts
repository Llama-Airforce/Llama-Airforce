import type { Observable, Subscription } from "rxjs";

/** Options for useQueryRx function */
type UseQueryRxOptions<T, U> = {
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
export function useQueryRx<T, U>({
  queryKey,
  queryFn,
  enabled,
  observable,
  setQueryData,
  staleTime,
}: UseQueryRxOptions<T, U>) {
  const queryClient = useQueryClient();

  let queryResolve: ((value: U) => void) | null = null;
  let queryReject: ((reason: unknown) => void) | null = null;

  const query = useQuery({
    queryKey,
    queryFn: () => {
      queryFn();

      /*
       * The queryFn will be in 'fetching' state until the watchEffect
       * resolves it when it has called setQueryData.
       */
      return new Promise<U>((resolve, reject) => {
        queryResolve = resolve;
        queryReject = reject;
      });
    },
    enabled: computed(() => enabled.value && !!observable.value),
    // Staletime being set as undefined is different from not setting it at all.
    ...(staleTime !== undefined ? { staleTime } : {}),
  });

  let subscription: Subscription | null = null;

  watchEffect(() => {
    subscription?.unsubscribe();

    // Resubscribe is query is enabled and we have an observable to subscribe to.
    if (enabled.value && observable.value) {
      subscription = observable.value.subscribe({
        next: (data: T) => {
          const oldData = queryClient.getQueryData<U | undefined>(
            queryKey.value
          );

          const newData = setQueryData(oldData, data);
          queryClient.setQueryData(queryKey.value, newData);
          queryResolve?.(newData);
        },

        error: (error: unknown) => {
          queryReject?.(
            error instanceof Error ? error : new Error(String(error))
          );
        },
      });
    }
  });

  onUnmounted(() => subscription?.unsubscribe());

  return query;
}
