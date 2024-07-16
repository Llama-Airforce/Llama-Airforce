<template>
  <div
    class="datatable"
    :class="{ loading }"
    :inert="!!loading"
  >
    <div
      v-if="header"
      class="header"
    >
      <div
        v-if="icon"
        class="header-icon"
      >
        <i :class="icon"></i>
      </div>

      <div
        class="header-content"
        :style="columnsHeaderCss"
      >
        <slot name="header-content"></slot>
      </div>
    </div>

    <div class="list">
      <!-- DataTable column headers -->
      <div
        v-if="columns.length > 0"
        class="row-data"
        :class="[columnsData, { 'selected-below': selectedBelow(-1) }]"
      >
        <slot name="column-headers">
          <div
            v-for="(column, index) in columns"
            :key="column"
            class="column-header"
            :class="{
              'sortable-header': sorting && isSortingEnabled(index),
              'current-sort': currentSort == sortingColumns[index],
            }"
            @click="sortColumn(index)"
          >
            {{ column }}

            <div
              v-if="sorting && isSortingEnabled(index)"
              class="sorting-arrows"
            >
              <i
                v-if="isSortAscending(index)"
                class="sorting-arrow fa fa-caret-up"
              ></i>
              <i
                v-else-if="isSortDescending(index)"
                class="sorting-arrow fa fa-caret-down"
              ></i>
              <span
                v-else
                class="sorting-arrow"
              >
                &#8212;
              </span>
            </div>
          </div>
        </slot>
      </div>

      <div class="rows">
        <Spinner
          v-if="loading !== null"
          class="loader"
          :class="{ loading }"
        ></Spinner>

        <!-- DataTable rows -->
        <DataTableRow
          v-for="(row, i) in rows"
          :key="(row as never)"
          :data="row"
          :class="{ 'selected-below': selectedBelow(i) }"
          :columns="columnsData"
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
          v-if="!rowsMin && (!rows || rows.length === 0) && !loading"
          class="no-data"
        >
          <slot name="no-data">{{ t("no-data") }}</slot>
        </div>

        <!-- Aggregation -->
        <DataTableRow
          v-if="!!$slots['row-aggregation'] && rows.length > 0"
          class="aggregation"
          :columns="columnsData"
        >
          <template #row>
            <slot name="row-aggregation"></slot>
          </template>
        </DataTableRow>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="TData, TSortingColumn extends string">
import { type SortOrder } from "@/Framework/SortOrder";

const { t } = useI18n();

// Props
interface Props {
  /** CSS column templates of the header.. */
  columnsHeader?: string;
  /** CSS column templates of the underlying data rows. */
  columnsData?: string;
  /** The names of the columns. */
  columns?: string[];

  /** The rows of the data table. */
  rows?: TData[];
  /** The minimum number of rows in case you don't want to show the 'no data' message. */
  rowsMin?: number | null;
  /** The row that should be highlighted as being selected. */
  selectedRow?: TData;

  /** All currently expanded rows */
  expanded?: TData[];
  expandSide?: "left" | "right";

  /** Whether columns can be sorted or not. */
  sorting?: boolean;

  /** The names of the sorting columns. */
  sortingColumns?: readonly TSortingColumn[];
  sortingColumnsEnabled?: readonly TSortingColumn[];
  sortingDefaultColumn?: TSortingColumn;
  sortingDefaultDir?: SortOrder;

  /** Icon shown to the left of the header title. */
  icon?: string;

  header?: boolean;
  loading?: boolean;
}

const {
  columnsHeader = "auto",
  columnsData = "auto",
  columns = [],

  rows = [],
  rowsMin = null,
  selectedRow = null,

  expanded = [],
  expandSide = "right",
  sorting = false,

  sortingColumns = [],
  sortingColumnsEnabled = [],
  sortingDefaultColumn,
  sortingDefaultDir,

  icon = "",
  header = true,
  loading = null,
} = defineProps<Props>();

// Emits
const emit = defineEmits<{
  selected: [data: TData];
  sortColumn: [sort: TSortingColumn, sortOrder: SortOrder];
}>();

// Refs
const currentSort = ref(undefined) as Ref<TSortingColumn | undefined>;
const currentSortDir = ref<SortOrder>("asc");

const columnsHeaderCss = computed((): string => {
  return `grid-template-columns: ${columnsHeader}`;
});

const rowsEmpty = computed((): never[] => {
  if (rowsMin === null) {
    return [];
  }

  const count = Math.max(0, rowsMin - rows.length);
  return new Array<never>(count);
});

// Hooks
onBeforeMount(() => {
  if (sortingDefaultColumn) {
    currentSort.value = sortingDefaultColumn;
  }

  if (sortingDefaultDir) {
    currentSortDir.value = sortingDefaultDir;
  }
});

// Events
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

const isSortingEnabled = (index: number) =>
  sortingColumnsEnabled.includes(sortingColumns[index]);

const isSortAscending = (index: number) =>
  currentSort.value === sortingColumns[index] && currentSortDir.value === "asc";

const isSortDescending = (index: number) =>
  currentSort.value === sortingColumns[index] &&
  currentSortDir.value === "desc";

const sortColumn = (index: number): void => {
  // Only sort columns where sorting is enabled.
  if (!sorting || !isSortingEnabled(index)) {
    return;
  }

  const columnName = sortingColumns[index];

  currentSortDir.value =
    columnName === currentSort.value
      ? currentSortDir.value === "asc" // Reverse
        ? "desc"
        : "asc"
      : "asc";

  currentSort.value = columnName;

  emit("sortColumn", columnName, currentSortDir.value);
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
  padding: 0.875rem 1.125rem;

  background: var(--c-lvl1);
  border-radius: var(--border-radius);
  box-shadow: var(--container-box-shadow);

  @include loading-backdrop();

  > .header {
    padding: 0 0 0.875rem 0rem;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;

    > .header-icon {
      grid-column: 1;

      display: flex;
      align-items: center;
      color: var(--c-primary);

      &:not(:empty) {
        margin-right: 1rem;
      }
    }

    > .header-content {
      grid-column: 2;
      display: grid;
      align-items: center;
      height: 2.5rem;

      button {
        border: 0;
      }

      :deep(.title) {
        font-size: 1.125rem;
        font-weight: bolder;
        color: var(--c-text);
        align-items: center;
      }
    }
  }

  > .list {
    display: flex;
    flex-direction: column;
    overflow-y: auto;

    > .rows {
      display: flex;
      flex-direction: column;
      overflow-y: auto;

      min-height: 80px; // Size of the loader, hardcoded, dunno how to make dynamic.
      position: relative;

      > .loader {
        position: absolute;
        inset: 0;
        margin: auto auto;
        z-index: 1;

        @include loading-spinner();
      }

      > .no-data {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        justify-content: center;
        margin: 0 auto;
      }
    }
  }

  :deep(.row) {
    &.expanded {
      > .row-data {
        background: var(--c-lvl1);
        border-bottom-width: 0;
      }
    }

    &.aggregation {
      border-top: var(--datatable-border-aggregation);
    }
  }

  :deep(.row-details) {
    border-bottom: var(--border-thickness) solid var(--c-lvl4);
  }

  :deep(.row-data) {
    display: grid;
    padding: 0 1rem;
    grid-column-gap: 1rem;
    min-height: 3rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    //border-bottom: var(--border-thickness) solid var(--c-lvl4);
    align-items: center;
    transition: background $datatable-hover-duration;

    &:last-child {
      border-bottom-width: 0;
    }

    &.selected-below {
      border-bottom: var(--border-thickness) solid var(--c-primary);
    }

    > .column-header {
      display: flex;
      align-items: center;
      font-weight: 800;
      height: 2.75rem;
      overflow: hidden;

      &.number {
        justify-content: flex-end;
      }

      .icon {
        color: var(--c-primary);
        padding-right: 1rem;
      }

      &.sortable-header {
        cursor: pointer;
        -webkit-tap-highlight-color: transparent; // Disable blue highlight because of pointer.
        user-select: none;

        &.current-sort {
          > .sorting-arrows {
            > .sorting-arrow {
              color: var(--c-primary);
            }
          }
        }

        > .sorting-arrows {
          display: flex;
          flex-direction: column;
          margin-left: 0.5rem;
          width: 10px;

          > .sorting-arrow {
            font-size: 1rem;
            color: var(--c-lvl4);
          }
        }
      }
    }

    &.active {
      border-bottom: var(--border-thickness) solid var(--c-primary);
    }

    &.item {
      &.has-data {
        &:hover {
          background: var(--container-background-hover);
        }

        &:active,
        &.active {
          background: var(--container-background-active);
        }
      }

      // These direct divs are most likely your individual cells.
      div {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;

        &.number {
          justify-self: flex-end;
        }
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
no-data: No data :(
</i18n>

<i18n lang="yaml" locale="zh">
no-data: 没有数据 :(
</i18n>
