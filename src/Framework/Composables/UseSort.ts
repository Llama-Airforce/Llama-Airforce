import type { SortOrder } from "@/Types/SortOrder";

type Column<T> = { id: T; label: string; sort: boolean } | string;
type ExtractColumnId<T> = T extends { id: infer U; sort: true } ? U : never;

/**
 * Vue composable for managing sorting state within a table.
 *
 * @param initSort - The initial column ID to be sorted by.
 * @param initOrder - (Optional) The initial sorting direction, defaults to "desc" if unspecified.
 * @returns An object containing:
 *   - sortColumn: A ref that holds the currently active sort column ID.
 *   - sortOrder: A ref that holds the current sorting direction.
 *   - sorting: A computed property that combines sortColumn and sortOrder.
 *   - onSort: A function that updates the sort column and direction.
 */
export function useSort<T extends readonly Column<string>[]>(
  initSort: ExtractColumnId<T[number]>,
  initOrder?: SortOrder
) {
  const sortColumn = ref(initSort) as Ref<ExtractColumnId<T[number]>>;
  const sortOrder = ref(initOrder ?? "desc");

  const onSort = (
    columnName: ExtractColumnId<T[number]>,
    order: SortOrder
  ): void => {
    sortColumn.value = columnName;
    sortOrder.value = order;
  };

  const sorting = computed(() => ({
    column: sortColumn.value,
    order: sortOrder.value,
  }));

  return { sortColumn, sortOrder, sorting, onSort };
}
