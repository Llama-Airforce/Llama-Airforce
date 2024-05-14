import { ref, type Ref, computed, watch } from "vue";
import { chain } from "lodash";

/** Vue composable that returns functionality for datatable pagination where all data is loaded. */
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

/** Same method as above, except you don't have all the rows up up-front. */
export function usePaginationAsync() {
  const page = ref(1);

  const onPage = (pageNew: number) => {
    page.value = pageNew;
  };

  return { page, onPage };
}
