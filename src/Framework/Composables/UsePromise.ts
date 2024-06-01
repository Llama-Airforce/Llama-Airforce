/**
 * Vue composable to asynchronously load data and handle errors through notifications.
 *
 * @param f - The async factory function that retrieves data.
 * @param init - The default / initial value of the data before loading is complete.
 * @returns An object containing:
 *   - loading: A ref indicating whether data is currently being loaded.
 *   - data: A ref holding the loaded data or the initial value.
 *   - load: A function to manually trigger data loading.
 */
export function usePromise<T>(f: () => Promise<T>, init: T) {
  const loading = ref(false);
  const data = ref<T>(init) as Ref<T>;

  // Loading as long as multiple load calls are active.
  let loaders = 0;

  const load = () => {
    loaders++;
    loading.value = true;

    return tryNotify(async () => {
      data.value = await f();
      loaders--;
      loading.value = loaders !== 0;
    }) as Promise<void>;
  };

  onMounted(() => void load());

  return { loading, data, load };
}
