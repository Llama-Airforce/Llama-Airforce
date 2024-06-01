import { type SortOrder } from "@/Framework/SortOrder";

/**
 * Vue composable that provides functionality for sorting data in a datatable.
 *
 * @param initSort - The initial sort column name.
 * @param initOrder - (Optional) The initial sort order. Defaults to SortOrder.Descending.
 * @returns An object containing:
 *   - sortColumn: A ref holding the current sort column name.
 *   - sortOrder: A ref holding the current sort order.
 *   - onSort: A function to update the sort column and order.
 */
export function useSort<T extends string>(initSort: T, initOrder?: SortOrder) {
  const sortColumn = ref<T>(initSort) as Ref<T>;
  const sortOrder = ref(initOrder ?? "desc");

  const onSort = (columnName: string, order: SortOrder): void => {
    sortColumn.value = columnName as T;
    sortOrder.value = order;
  };

  return { sortColumn, sortOrder, onSort };
}
