<template>
  <div class="datatable">
    <!-- DataTable column headers -->
    <DataTableRow
      v-if="columns.length > 0"
      :class="{ 'selected-below': selectedBelow(-1) }"
    >
      <template #row>
        <div
          v-for="column in columnsObjects"
          :key="column.id"
          class="column-header"
          :class="{
            sortable: column.sort,
            sorting: column.sort && sorting.column === column.id,
            [column.align || '']: !!column.align,
          }"
          @click="sortColumn(column)"
        >
          <span>{{ column.label }}</span>

          <i
            v-if="column.sort"
            class="sorting-arrow fa fa-caret-right"
            :class="{
              asc: isSortAscending(column),
              desc: isSortDescending(column),
            }"
          ></i>
        </div>
      </template>
    </DataTableRow>

    <!-- DataTable rows -->
    <DataTableRow
      v-for="(row, i) in rows"
      :key="(row as never)"
      :data="row"
      :class="{ 'selected-below': selectedBelow(i) }"
      :selected="selectedRow === row"
      :expanded="expanded.includes(row)"
      :expand-side="expandSide"
      @click="onSelect"
    >
      <template #row>
        <slot
          name="row"
          :item="(row as never)"
        ></slot>
      </template>

      <template #row-details>
        <slot
          name="row-details"
          :item="(row as never)"
        ></slot>
      </template>
    </DataTableRow>

    <!-- Empty DataTable rows in case minRows is set -->
    <DataTableRow
      v-for="row in rowsEmpty"
      :key="row"
    >
    </DataTableRow>

    <!-- No data to show. -->
    <div
      v-if="!rowsMin && (!rows || rows.length === 0)"
      class="no-data"
    >
      <slot name="no-data">{{ t("no-data") }}</slot>
    </div>

    <!-- Aggregation -->
    <DataTableRow
      v-if="!!$slots['row-aggregation'] && rows.length > 0"
      class="aggregation"
    >
      <template #row>
        <slot name="row-aggregation"></slot>
      </template>
    </DataTableRow>
  </div>
</template>

<script setup lang="ts" generic="TData, TSortingColumn extends string">
import { type SortOrder } from "@/Framework/SortOrder";

const { t } = useI18n();

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

// Props
interface Props {
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

  /** Icon shown to the left of the header title. */
  icon?: string;
}

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
} = defineProps<Props>();

// Emits
const emit = defineEmits<{
  selected: [data: TData];

  /*
   * I couldn't get the sort parameter type to only be
   * columns where sort is true, so I set it to never
   * to ignore typescript issues for now. Most likely
   * it'll be used in conjunction with useSort anyway.
   */
  sortColumn: [sort: never, sortOrder: SortOrder];
}>();

// Refs
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

// Selecting
const onSelect = (data?: TData): void => {
  if (data) {
    emit("selected", data);
  }
};

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
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable {
  position: relative;

  display: flex;
  flex-direction: column;
  flex-grow: 1;
  font-size: 0.875rem;

  background: var(--c-lvl1);

  overflow-y: auto;
  min-height: 80px; // Size of the loader, hardcoded, dunno how to make dynamic.

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
      -webkit-tap-highlight-color: transparent; // Disable blue highlight because of pointer.
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
    border-top: var(--datatable-border-aggregation);
  }

  > .no-data {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    justify-content: center;
    margin: 0 auto;
  }
}
</style>

<i18n lang="yaml" locale="en">
no-data: No data :(
</i18n>

<i18n lang="yaml" locale="zh">
no-data: 没有数据 :(
</i18n>
