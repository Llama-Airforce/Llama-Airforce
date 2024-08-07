import type { Observable, Subscription } from "rxjs";

/** Options for useQueryRx function */
type UseQueryRxOptions<T, U = T> = {
  /** Unique key for identifying and caching the query */
  queryKey: Ref<readonly unknown[]>;

  /** Function to trigger a (re)fetch of data and resubscribe */
  queryFn: () => void;

  /** Controls whether the query should execute */
  enabled: Ref<boolean>;

  /**
   * RxJS Observable for real-time updates.
   * When the observable changes, the composable unsubscribes from the current
   * subscription and resubscribes to the new observable.
   */
  observable: Ref<Observable<T> | undefined>;

  /** Function to merge new data with existing query data */
  setQueryData: (oldData: U | undefined, data: T) => U;

  /** Clear old data on resubscription during a refetch */
  resetOnSubscribe: boolean;
};

/** Represents a record of an RxJS subscription with a reference count */
type SubscriptionRecord = {
  subscription: Subscription;
  count: number;
};

/** Global map to store and manage shared subscriptions across multiple query instances */
const subscriptions = new Map<string, SubscriptionRecord>();

/**
 * Combines Vue Query with never ending RxJS Observables for reactive data fetching and updates.
 *
 * This composable integrates RxJS Observables with Vue Query, providing:
 * 1. Subscription to RxJS Observable for real-time updates.
 * 2. Automatic query cache updates when new data arrives.
 * 3. Shared subscription management across multiple query instances.
 *
 * It's suited for scenarios requiring live updates from streaming data sources,
 * such as WebSocket connections.
 *
 * @template T The type of data emitted by the Observable
 * @template U The type of data stored in the query cache
 * @param options Configuration options for the query and Observable
 * @returns A Vue Query result object with real-time update capabilities
 *
 * @example
 * const transfersService = ref(new TransfersService(socket));
 * const { data, isFetching } = useQueryRx({
 *   queryKey: computed(() => ["transfers", url.value] as const),
 *   queryFn: () => transfersService.value?.subTransfers(),
 *   enabled: computed(() => !!socket),
 *   observable: computed(() => transfersService.value?.transfers$),
 *   setQueryData: (oldData, newData) => [...(oldData ?? []), ...newData],
 *   resetOnSubscribe: true,
 * });
 */
export function useQueryRx<T, U = T>({
  queryKey,
  queryFn,
  enabled,
  observable,
  setQueryData,
  resetOnSubscribe,
}: UseQueryRxOptions<T, U>) {
  const queryClient = useQueryClient();

  const queryKeyString = computed(() => JSON.stringify(queryKey.value));
  const queryEnabled = computed(() => enabled.value && !!observable.value);

  // Flag for this specific usQuery instance to prevent double cleanups.
  let isSubscribed = false;

  const query = useQuery({
    queryKey,
    queryFn: () =>
      // This promise won't resolve until the subscription receives its first data.
      new Promise<U>((resolve, reject) => {
        // Clear old data from cache if we're refetching and resubscribing.
        if (resetOnSubscribe) {
          queryClient.setQueryData(queryKey.value, null);
        }

        // Unsubscribe from any previous subscription to prevent leaks.
        let record = subscriptions.get(queryKeyString.value);
        record?.subscription?.unsubscribe();

        record = {
          subscription: observable.value!.subscribe({
            next: (data: T) => {
              const oldData = queryClient.getQueryData<U | undefined>(queryKey);

              const newData = setQueryData(oldData, data);
              queryClient.setQueryData(queryKey.value, newData);
              resolve(newData);
            },
            error: (error: unknown) => {
              reject(error instanceof Error ? error : new Error(String(error)));
            },
          }),
          // Count is 1 if it's new, otherwise it stays the same since it was a resub.
          count: record?.count ?? 1,
        };

        subscriptions.set(queryKeyString.value, record);
        isSubscribed = true;

        queryFn();
      }),
    enabled: queryEnabled,
    staleTime: Infinity,
  });

  /** Clean up when the query becomes disabled to prevent memory leaks */
  watch(queryEnabled, async (newQueryEnabled) => {
    if (!newQueryEnabled) {
      await cleanup();
    }
  });

  /**
   * When the observable changes, invalidate the query to trigger a refetch
   * and resubscription to the new observable. This is not done when the
   * observable is first set from undefined, as the query enablement will
   * trigger the initial fetch.
   */
  watch(observable, async (newObservable, oldObservable) => {
    if (oldObservable && newObservable !== oldObservable) {
      await queryClient.invalidateQueries({
        queryKey,
      });
    }
  });

  /**
   * Cleanup subscriptions when the component is unmounted.
   * This prevents memory leaks and unnecessary network activity.
   */
  onUnmounted(async () => {
    await cleanup();
  });

  /**
   * Tracks query usages. When no usages remain, unsubscribes and invalidates cache,
   * ensuring queryFn resubscribes on next use.
   */
  async function cleanup() {
    /*
     * Prevent double cleanups by first checking if this specific query usage
     * is subscribed at all.
     */
    if (!isSubscribed) {
      return;
    }

    const record = subscriptions.get(queryKeyString.value);
    if (!record) {
      return;
    }

    record.count--;

    // Delete and unsubscribe if this was the last consumer of the sub.
    if (record.count === 0) {
      record.subscription.unsubscribe();
      subscriptions.delete(queryKeyString.value);
      await queryClient.invalidateQueries({ queryKey });
    }

    isSubscribed = false;
  }

  return query;
}
