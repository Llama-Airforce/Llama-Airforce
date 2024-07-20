/**
 * Vue composable for managing a list of expanded items.
 *
 * @template T - The type of the items to be expanded.
 * @returns An object containing:
 *   - expanded: A ref holding an array of expanded items.
 *   - toggleExpansion: A function to toggle the expansion state of an item.
 *     Returns true if the item was added to the expanded list, false if it was removed.
 *
 * @example
 * ```
 * const { expanded, toggleExpansion } = useExpansion<Row>();
 * const isExpanded = toggleExpansion(row);
 * ```
 */
export function useExpansion<T>() {
  const expanded = ref<T[]>([]) as Ref<T[]>;

  const toggleExpansion = (item: T): boolean => {
    const index = expanded.value.findIndex((r) => r === item);
    if (index === -1) {
      expanded.value.push(item);
      return true;
    } else {
      expanded.value.splice(index, 1);
      return false;
    }
  };

  return { expanded, toggleExpansion };
}
