import { ref, type Ref } from "vue";
import { tryNotify } from "@/Util";

export function useData<T>(f: () => Promise<T>, init: T) {
  const loading = ref(false);
  const data = ref<T>(init) as Ref<T>;

  const loadData = () => {
    loading.value = true;

    return tryNotify(async () => {
      data.value = await f();
      loading.value = false;
    }) as Promise<void>;
  };

  return { loading, data, loadData };
}
