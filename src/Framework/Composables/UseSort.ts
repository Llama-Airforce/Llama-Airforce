import { SortOrder } from "@/Framework/SortOrder";

/** Vue composable that returns functionality for datatable sorting. */
export function useSort<T extends string>(initSort: T, initOrder?: SortOrder) {
  const sortColumn = ref<T>(initSort) as Ref<T>;
  const sortOrder = ref(initOrder ?? SortOrder.Descending);

  const onSort = (columnName: string, order: SortOrder): void => {
    sortColumn.value = columnName as T;
    sortOrder.value = order;
  };

  return { sortColumn, sortOrder, onSort };
}
