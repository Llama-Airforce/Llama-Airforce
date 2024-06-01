import { type SortOrder } from "@/Framework/SortOrder";

/**
 * Vue composable for managing sorting state within a datatable.
 *
 * @param sortColumns - An array specifying the column names that are eligible for sorting.
 * @param initSort - The initial column name to be sorted by.
 * @param initOrder - (Optional) The initial sorting direction, defaults to SortOrder.Descending if unspecified.
 * @returns An object containing:
 *   - sortColumns: The array of column names that can be sorted.
 *   - sortColumnsNoEmpty: The array of columns but without empty string columns.
 *   - sortColumn: A ref that holds the currently active sort column.
 *   - sortOrder: A ref that holds the current sorting direction.
 *   - onSort: A function that modifies the sort column and direction in response to user actions.
 */
export function useSort<TColumn extends string>(
  sortColumns: readonly TColumn[],
  initSort: TColumn extends infer U ? (U extends string ? U : never) : never,
  initOrder?: SortOrder
) {
  const sortColumn = ref(initSort) as Ref<TColumn>;
  const sortOrder = ref(initOrder ?? "desc");

  const onSort = (columnName: TColumn, order: SortOrder): void => {
    sortColumn.value = columnName;
    sortOrder.value = order;
  };

  const sortColumnsNoEmpty = computed(() =>
    sortColumns.filter((column) => column !== "")
  );

  return { sortColumns, sortColumnsNoEmpty, sortColumn, sortOrder, onSort };
}
