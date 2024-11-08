<script setup lang="ts" generic="TData, const TSortingColumn extends string">
import type { SortOrder } from "../Types/SortOrder";

type Column = {
  id?: TSortingColumn;
  label: string;
  sort?: boolean;
  align?: "center" | "end";
};
type Columns = (Column | string)[];

type Sorting = {
  column?: TSortingColumn;
  order: SortOrder;
};

const {
  columns = [],
  rows = [],
  rowsMin = null,

  selectedRow = null,

  expanded = [],
  expandSide = "right",

  sorting = {
    order: "asc",
  },
} = defineProps<{
  columns?: Columns;
  rows?: TData[];

  /** The minimum number of rows in case you don't want to show the 'no data' message. */
  rowsMin?: number | null;

  /** The row that should be highlighted as being selected. */
  selectedRow?: TData;

  /** All currently expanded rows */
  expanded?: TData[];
  expandSide?: "left" | "right";

  /** Current sorting state. */
  sorting?: Sorting;
}>();

const emit = defineEmits<{
  select: [data: TData];

  /*
   * I couldn't get the sort parameter type to only be
   * columns where sort is true, so I set it to never
   * to ignore typescript issues for now. Most likely
   * it'll be used in conjunction with useSort anyway.
   */
  sortColumn: [sort: never, sortOrder: SortOrder];
}>();

const rowsEmpty = computed((): never[] => {
  if (rowsMin === null) {
    return [];
  }

  const count = Math.max(0, rowsMin - rows.length);
  return new Array<never>(count);
});

const columnsObjects = computed((): Column[] =>
  columns.map((column) => {
    if (typeof column === "string") {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      return { id: column as TSortingColumn, label: column };
    }

    return column;
  })
);

/** Return whether the row below the given row's index is selected */
const selectedBelow = (index: number): boolean => {
  const rowBelowIndex = index + 1;
  const rowBelow = rows[index + 1];

  if (rowBelow) {
    const selectedRowIndex = rows.findIndex((row) => row === selectedRow);

    if (selectedRowIndex === rowBelowIndex) {
      return true;
    }
  }

  return false;
};

// Sorting
const isSortAscending = (column: Column) =>
  sorting.column === column.id && sorting.order === "asc";

const isSortDescending = (column: Column) =>
  sorting.column === column.id && sorting.order === "desc";

const sortColumn = (column: Column): void => {
  // Only sort columns where sorting is enabled.
  if (!column.sort) {
    return;
  }

  const newOrder =
    column.id === sorting.column
      ? sorting.order === "asc" // Reverse
        ? "desc"
        : "asc"
      : "asc";

  emit("sortColumn", column.id as never, newOrder);
};

const instance = getCurrentInstance();
const selectable = computed(() => !!instance?.vnode.props?.[`onSelect`]);
</script>

<template>
  <div class="table">
    <!-- Table column headers -->
    <TableRow
      v-if="columns.length > 0"
      :class="{ 'selected-below': selectedBelow(-1) }"
      :hoverable="false"
    >
      <div
        v-for="column in columnsObjects"
        :key="column.id"
        class="column-header"
        :class="{
          sortable: column.sort,
          sorting: column.sort && sorting.column === column.id,
          [column.align || '']: !!column.align,
        }"
        @click="sortColumn(column as Column)"
      >
        <span>{{ column.label }}</span>

        <LucideChevronRight
          v-if="column.sort"
          class="sorting-arrow"
          :class="{
            asc: isSortAscending(column as Column),
            desc: isSortDescending(column as Column),
          }"
        />
      </div>
    </TableRow>

    <!-- Manual rows -->
    <slot></slot>

    <!-- Table rows -->
    <TableRow
      v-for="(row, i) in rows"
      :key="(row as never)"
      :data="row"
      :class="{ 'selected-below': selectedBelow(i) }"
      :selectable
      :selected="selectedRow === row"
      :expanded="expanded.includes(row as TData)"
      :expand-side
      @select="row && emit('select', row)"
    >
      <slot
        name="row"
        :item="row"
      ></slot>

      <template #row-details>
        <slot
          name="row-details"
          :item="row"
        ></slot>
      </template>
    </TableRow>

    <!-- Empty Table rows in case minRows is set -->
    <TableRow
      v-for="row in rowsEmpty"
      :key="row"
      :hoverable="false"
    />

    <!-- Aggregation -->
    <TableRow
      v-if="!!$slots['row-aggregation'] && rows.length > 0"
      class="aggregation"
      :hoverable="false"
    >
      <slot name="row-aggregation"></slot>
    </TableRow>
  </div>
</template>

<style scoped>
.table {
  position: relative;

  display: flex;
  flex-direction: column;
  font-size: 0.875rem;

  background: var(--c-lvl1);

  /* Size of the loader, hardcoded, dunno how to make dynamic. */
  min-height: 80px;

  --columns-data: auto;

  .column-header {
    display: flex;
    align-items: center;
    font-weight: 800;
    height: 2.75rem;

    > span {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    &.sortable {
      cursor: pointer;

      /* Disable blue highlight because of pointer. */
      -webkit-tap-highlight-color: transparent;
      user-select: none;

      gap: 1ch;

      &:hover {
        opacity: 0.7;
      }

      &.sorting {
        > .sorting-arrow {
          color: var(--c-primary);
        }
      }

      > .sorting-arrow {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 0.5ch;

        font-size: 1rem;
        color: var(--c-lvl4);

        transition: transform 125ms ease-in-out;
        transform-origin: center;
        transform: rotate(0deg);

        &.asc {
          transform: rotate(90deg);
        }

        &.desc {
          transform: rotate(-90deg);
        }
      }
    }
  }

  > .aggregation {
    border-top: var(--table-border-aggregation);
  }
}
</style>
