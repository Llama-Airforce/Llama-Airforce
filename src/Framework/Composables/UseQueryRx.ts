import { uniqueId } from "@/Utils/UniqueId";
import {
  type Observable,
  type Subscription,
  BehaviorSubject,
  filter,
} from "rxjs";

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

  /** Clear old data on resubscription during a refetch or cleanup */
  keepData: boolean;
};

/** Represents a record of an RxJS subscription with all its usages. */
type SubscriptionRecord = {
  subscription: Subscription;
  users: Set<string>;
};

/** Global map to store and manage shared subscriptions across multiple query instances */
const subscriptions = new Map<string, SubscriptionRecord>();

/** Event emitter in case a refetch has created a new sub, use it to increase usage counts */
const subscriptionSubject = new BehaviorSubject<
  { queryKeyString: string; record: SubscriptionRecord } | undefined
>(undefined);

const queryKeySerialize = (queryKey: readonly unknown[]) =>
  JSON.stringify(queryKey);

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
 *   keepData: true,
 * });
 */
export function useQueryRx<T, U = T>({
  queryKey,
  queryFn,
  enabled,
  observable,
  setQueryData,
  keepData,
}: UseQueryRxOptions<T, U>) {
  const queryClient = useQueryClient();
  const queryEnabled = computed(() => enabled.value && !!observable.value);

  const query = useQuery({
    queryKey,
    queryFn: () =>
      // This promise won't resolve until the subscription receives its first data.
      new Promise<U>((resolve, reject) => {
        // Clear old data from cache if we're refetching and resubscribing.
        if (!keepData) {
          queryClient.setQueryData(queryKey.value, undefined);
        }

        // Unsubscribe from any previous subscription to prevent leaks.
        const queryKeyString = queryKeySerialize(queryKey.value);

        let record = subscriptions.get(queryKeyString);
        const sub = record?.subscription;
        sub?.unsubscribe();

        // Create new subscription here.
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

        subscriptions.set(queryKeyString, record);
        subscriptionSubject.next({ queryKeyString, record });

        queryFn();
      }),
    enabled: queryEnabled,
    staleTime: Infinity,
  });

  useCleanup({ queryKey, enabled: queryEnabled, keepData, observable });

  return query;
}

/**
 * Handles cleanup of RxJS subscriptions and query cache for a specific query.
 *
 * @param queryKey - Ref containing the query key array
 * @param enabled - Ref indicating if the query is enabled
 * @param observable - Ref containing the RxJS Observable
 * @param keepData - Boolean indicating whether to keep data on cleanup
 */
function useCleanup<T, U = T>({
  queryKey,
  enabled: queryEnabled,
  observable,
  keepData,
}: Pick<
  UseQueryRxOptions<T, U>,
  "queryKey" | "enabled" | "observable" | "keepData"
>) {
  const queryClient = useQueryClient();
  const userId = uniqueId();

  // Subscribe to new subscription records and update the usage set.
  const newSubRecordSub = subscriptionSubject
    .pipe(
      filter(() => queryEnabled.value),
      filter((x) => x !== undefined),
      filter((x) => x.queryKeyString === queryKeySerialize(queryKey.value))
    )
    .subscribe((sub) => {
      sub.record.users.add(userId);
    });

  // Clean up on query disable to prevent bandwidth consumption, add usage on re-enable.
  watch(queryEnabled, async (queryEnabled) => {
    if (!queryEnabled) {
      await cleanup(queryKey.value);
    } else {
      const queryKeyString = queryKeySerialize(queryKey.value);
      const subRecord = subscriptions.get(queryKeyString);

      if (subRecord) {
        subRecord.users.add(userId);
      }
    }
  });

  /*
   * If the query key has changed, it means the query will refetch and resubscribe,
   * therefore it should also be cleaned up.
   */
  watch(queryKey, async (_newQueryKey, oldQueryKey) => {
    await cleanup(oldQueryKey);
  });

  /**
   * When the observable changes, invalidate the query to trigger a refetch
   * and resubscription to the new observable. This is not done when the
   * observable is first set from undefined, as the query enablement will
   * trigger the initial fetch.
   */
  watch(observable, async (newObservable, oldObservable) => {
    if (oldObservable && newObservable !== oldObservable) {
      await cleanQuery(queryKey.value);
    }
  });

  // Ensure cleanup is performed when the component unmounts to prevent memory leaks.
  onUnmounted(async () => {
    await cleanup(queryKey.value);
    newSubRecordSub.unsubscribe();
  });

  /**
   * Decrement the subscription usage count and perform cleanup if necessary.
   * If this was the last consumer, unsubscribe, remove the record, and invalidate the query cache.
   * @param queryKey - The query key to clean up
   */
  async function cleanup(queryKey: readonly unknown[]) {
    const queryKeyString = queryKeySerialize(queryKey);
    const subRecord = subscriptions.get(queryKeyString);
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
      subscriptions.delete(queryKeyString);
      await cleanQuery(queryKey);
    }
  }

  /**
   * Cleans up a query by canceling, invalidating, and optionally clearing its data.
   * @param queryKey - The key identifying the query to clean
   */
  async function cleanQuery(queryKey: readonly unknown[]) {
    await queryClient.cancelQueries({ queryKey });
    await queryClient.invalidateQueries({ queryKey });

    // Clear old data from cache if we're refetching and resubscribing.
    if (!keepData) {
      queryClient.setQueryData(queryKey, undefined);
    }
  }

  return cleanup;
}
