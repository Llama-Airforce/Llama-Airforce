import { type LegendItem } from "@/Framework/Monitor/LegendItem";

/**
 * A composable function to manage legend items and their toggle states.
 *
 * This function provides reactive legend items and their toggle states for use in components
 * that require a legend with togglable items. It also computes which items are currently disabled
 * based on their toggle state.
 *
 * @template T - A string literal type that represents the unique IDs of the legend items.
 * @param f - A function that returns an array of LegendItem<T>. This function is used to initialize
 *            the legend items and their default states.
 * @returns An object containing:
 *          - items: A reactive reference to the array of legend items.
 *          - toggles: A reactive object with keys as item IDs and values as booleans representing
 *                     the toggle state.
 *          - disabled: A computed array of item IDs that are currently disabled (toggled off).
 *
 * @example
 * ```typescript
 * const { items, toggles, disabled } = useLegend(() => [
 *   { id: 'sales', label: 'Sales', color: 'blue', togglable: true },
 *   { id: 'revenue', label: 'Revenue', color: 'green', togglable: true }
 * ]);
 *
 * // Access legend items
 * console.log(items.value);
 *
 * // Toggle an item
 * toggles.sales.value = false;
 *
 * // Check disabled items
 * console.log(disabled.value); // ['sales']
 * ```
 */
export function useLegend<const T extends string>(f: () => LegendItem<T>[]) {
  const items = computed(f);

  const toggles = toRefs(
    reactive(
      Object.fromEntries(items.value.map((item) => [item.id, true])) as Record<
        T,
        boolean
      >
    )
  );

  const disabled = computed(() =>
    items.value.filter((item) => !toggles[item.id].value).map((item) => item.id)
  );

  return { items, toggles, disabled };
}
