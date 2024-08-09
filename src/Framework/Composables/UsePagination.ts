import { chain } from "lodash";

/**
 * Vue composable that provides functionality for table pagination where all data is loaded.
 *
 * @param rows - A ref containing an array of rows to be paginated.
 * @param rowsPerPage - The number of rows to display per page.
 * @returns An object containing:
 *   - page: A ref holding the current page number.
 *   - rowsPage: A computed ref containing the rows for the current page.
 *   - onPage: A function to update the current page number.
 */
export function usePagination<Row>(rows: Ref<Row[]>, rowsPerPage: number) {
  const page = ref(1);

  const rowsPage = computed((): Row[] =>
    chain(rows.value)
      .drop((page.value - 1) * rowsPerPage)
      .take(rowsPerPage)
      .value()
  );

  const onPage = (pageNew: number) => {
    page.value = pageNew;
  };

  watch(rowsPage, (ps) => {
    if (ps.length === 0) {
      page.value = Math.max(1, Math.ceil(rows.value.length / rowsPerPage));
    }
  });

  return { page, rowsPage, onPage };
}

/**
 * Vue composable that provides functionality for asynchronous table pagination.
 *
 * @returns An object containing:
 *   - page: A ref holding the current page number.
 *   - onPage: A function to update the current page number.
 */
export function usePaginationAsync() {
  const page = ref(1);

  const onPage = (pageNew: number) => {
    page.value = pageNew;
  };

  return { page, onPage };
}
