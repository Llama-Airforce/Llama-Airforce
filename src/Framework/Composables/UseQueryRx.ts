import { uniqueId } from "@/Util";
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

/** Represents a record of an RxJS subscription with all its usages. */
type SubscriptionRecord = {
  subscription: Subscription;
  users: Set<string>;
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
        const sub = record?.subscription;
        sub?.unsubscribe();

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
           * A resubscription always starts with an empty usage set.
           * subscriptionSubject subscriptions should increase it again.
           */
          users: new Set<string>(),
        };

        subscriptions.set(queryKeyString.value, record);
        subscriptionSubject.next(record);

        queryFn();
      }),
    enabled: queryEnabled,
    staleTime: Infinity,
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

  useCleanup(queryKey, queryKeyString, queryEnabled);

  return query;
}

/**
 * Handles cleanup of RxJS subscriptions and query cache for a specific query.
 *
 * @param queryKey - Ref containing the query key array
 * @param queryKeyString - Ref containing the stringified query key
 * @param queryEnabled - Ref indicating if the query is enabled
 * @returns A cleanup function to be called when the query is disabled or the component unmounts
 */
function useCleanup(
  queryKey: Ref<readonly unknown[]>,
  queryKeyString: Ref<string>,
  queryEnabled: Ref<boolean>
) {
  const queryClient = useQueryClient();
  const userId = uniqueId();

  let subRecord: SubscriptionRecord | undefined;

  // Subscribe to new subscription records and update the usage set.
  const newSubRecordSub = subscriptionSubject.subscribe((newSub) => {
    subRecord = newSub;

    if (subRecord && queryEnabled.value) {
      subRecord.users.add(userId);
    }
  });

  // Clean up on query disable to prevent bandwidth consumption, add usage on re-enable.
  watch(queryEnabled, async (queryEnabled) => {
    if (!queryEnabled) {
      await cleanup();
    } else if (subRecord) {
      subRecord.users.add(userId);
    }
  });

  /**
   * Decrement the subscription usage count and perform cleanup if necessary.
   * If this was the last consumer, unsubscribe, remove the record, and invalidate the query cache.
   */
  async function cleanup() {
    if (!subRecord) {
      return;
    }

    subRecord.users.delete(userId);

    if (subRecord.users.size === 0) {
      /*
       * Unsubscribe the original subscription to release resources,
       * just in case the query does not get refetched and unsubscribed there.
       */
      subRecord.subscription.unsubscribe();

      subscriptions.delete(queryKeyString.value);
      await queryClient.invalidateQueries({ queryKey });
    }
  }

  // Ensure cleanup is performed when the component unmounts to prevent memory leaks.
  onUnmounted(async () => {
    await cleanup();
    newSubRecordSub.unsubscribe();
  });

  return cleanup;
}
