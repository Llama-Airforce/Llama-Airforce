import { ref, type Ref } from "vue";

/**
 * Vue composable primarily for datatables to keep track of a list of expanded rows.
 */
export function useExpansion<T>() {
  const expanded = ref<T[]>([]) as Ref<T[]>;

  const toggleExpansion = (item: T): boolean => {
    if (!expanded.value.includes(item)) {
      expanded.value.push(item);
      return true;
    } else {
      expanded.value = expanded.value.filter((x) => x !== item);
      return false;
    }
  };

  return { expanded, toggleExpansion };
}
