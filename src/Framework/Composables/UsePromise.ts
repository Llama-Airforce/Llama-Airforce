import { ref, type Ref, onMounted } from "vue";
import { tryNotify } from "@/Util";

/**
 * Vue composable to async load data and handle errors through notifications.
 * @param f The async factory function that retrieves data.
 * @param init The default / init value of the data before loading is complete.
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
