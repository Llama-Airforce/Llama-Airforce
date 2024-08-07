import { type Observable, type Subscription, BehaviorSubject } from "rxjs";

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

/** Event emitter in case a refetch has created a new sub, use it to increase usage counts */
const subscriptionSubject = new BehaviorSubject<SubscriptionRecord | undefined>(
  undefined
);

/**
 * Combines Vue Query with never ending RxJS Observables for reactive data fetching and updates.
 *
 * This composable integrates RxJS Observables with Vue Query, providing:
 * 1. Subscription to RxJS Observable for real-time updates.
 * 2. Automatic query cache updates when new data arrives.
 * 3. Shared subscription management across multiple query instances.
 * 4. Automatic cleanup of subscriptions when no longer needed.
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
// eslint-disable-next-line max-lines-per-function
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
          /*
           * A resub always starts with a new count.
           * subscriptionSubject subscriptions should increase it again.
           */
          count: 0,
        };

        subscriptions.set(queryKeyString.value, record);
        subscriptionSubject.next(record);

        queryFn();
      }),
    enabled: queryEnabled,
    staleTime: Infinity,
  });

  /**
   * Clean up when the query becomes disabled to prevent memory leaks.
   * When the query becomes disabled, all the cleanups will eventually
   * trigger a cache invalidation, and when it becomes enabled again
   * the queryFn will create a new subscription.
   */
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

  /*
   * We start in a 'cleaned up' state until the usageCountSub has recorded a sub.
   * This way calls the cleanup won't cause incorrect count management if there's no sub.
   */
  let isCleanedUp = true;

  // Whenever a resub happens, increase the usage count.
  const usageCountSub = subscriptionSubject.subscribe((subscriptionRecord) => {
    if (subscriptionRecord) {
      subscriptionRecord.count++;
      isCleanedUp = false;
    }
  });

  /**
   * Tracks query usages. When no usages remain, unsubscribes and invalidates cache,
   * ensuring queryFn resubscribes on next use.
   */
  async function cleanup() {
    // Prevent double cleanups by first checking if this specific query usage is subscribed at all.
    if (isCleanedUp) {
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

    isCleanedUp = true;
  }

  /**
   * Cleanup subscriptions when the component is unmounted.
   * This prevents memory leaks and unnecessary network activity.
   */
  onUnmounted(async () => {
    await cleanup();
    usageCountSub.unsubscribe();
  });

  return query;
}
