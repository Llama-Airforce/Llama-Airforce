<template>
  <div class="datatable">
    <div class="header">
      <div
        v-if="icon"
        class="header-icon"
      >
        <i :class="icon"></i>
      </div>

      <div
        class="header-title"
        :style="columnsHeaderCss"
      >
        <slot name="header-title"></slot>
      </div>

      <div class="header-actions">
        <slot name="header-actions"></slot>
      </div>
    </div>

    <div
      v-if="rowsMin || (rows && rows.length > 0)"
      class="list"
    >
      <!-- DataTable column headers -->
      <div
        class="row-data"
        :class="[columnsData, { 'selected-below': selectedBelow(-1) }]"
      >
        <slot name="column-headers">
          <div
            v-for="(column, index) in columns"
            :key="column"
            class="column-header"
            :class="{
              'sortable-header': sorting && sortingEnabled(index),
              'current-sort': currentSort == sortingColumns[index],
            }"
            @click="sortColumn(index)"
          >
            {{ column }}

            <div
              v-if="sorting && sortingEnabled(index)"
              class="sorting-arrows"
            >
              <i
                v-if="sortAscending(index)"
                class="sorting-arrow fa fa-caret-up"
              ></i>
              <i
                v-else-if="sortDescending(index)"
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
        <!-- DataTable rows -->
        <DataTableRow
          v-for="(row, i) in rows"
          :key="(row as never)"
          :data="row"
          :class="{ 'selected-below': selectedBelow(i) }"
          :columns="columnsData"
          :selected="selectedRow === row"
          :expanded="isExpanded(row as never)"
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
      </div>
    </div>

    <!-- No data to show. -->
    <div
      v-else-if="!rowsMin"
      class="no-data"
    >
      <slot name="no-data">{{ t("no-data") }}</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";
import { DataTableRow, SortOrder } from "@/Framework";

// Props
interface Props {
  /** CSS column templates of the header.. */
  columnsHeader?: string;
  /** CSS column templates of the underlying data rows. */
  columnsData?: string;
  /** The names of the columns. */
  columns?: string[];

  /** The rows of the data table. */
  rows?: unknown[];
  /** The minimum number of rows in case you don't want to show the 'no data' message. */
  rowsMin?: number | null;
  /** The row that should be highlighted as being selected. */
  selectedRow?: unknown | null;

  /** All currently expanded rows */
  expanded?: unknown[];
  /** Whether columns can be sorted or not. */
  sorting?: boolean;

  /** The names of the sorting columns. */
  sortingColumns?: string[];
  sortingColumnsEnabled?: string[];
  sortingDefaultColumn?: string | null;
  sortingDefaultDir?: string | null;

  /** Icon shown to the left of the header title. */
  icon?: string;
}

const {
  columnsHeader = "auto",
  columnsData = "auto",
  columns = [],

  rows = [],
  rowsMin = null,
  selectedRow = null,

  expanded = [],
  sorting = false,

  sortingColumns = [],
  sortingColumnsEnabled = [],
  sortingDefaultColumn = null,
  sortingDefaultDir = null,

  icon = "",
} = defineProps<Props>();

// Emits
const emit = defineEmits<{
  (e: "selected", data: unknown): void;
  (e: "sortColumn", sort: string, sortOrder: SortOrder): void;
}>();

// Refs
const currentSort = ref("");
const currentSortDir = ref(SortOrder.Ascending);

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
    currentSortDir.value =
      sortingDefaultDir === SortOrder.Ascending
        ? SortOrder.Ascending
        : SortOrder.Descending;
  }
});

// Events
const onSelect = (data: unknown): void => {
  emit("selected", data);
};

// Methods
const { t } = useI18n();

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

/**
 * Checks whether the given row is expanded or not.
 * @param row The row that should be checked for expansion.
 */
const isExpanded = (row: never): boolean => {
  return expanded.includes(row);
};

const sortingEnabled = (index: number): boolean => {
  const columnName = sortingColumns[index];
  return sortingColumnsEnabled.includes(columnName);
};

const sortAscending = (index: number): boolean => {
  return (
    currentSort.value === sortingColumns[index] &&
    currentSortDir.value === "Ascending"
  );
};

const sortDescending = (index: number): boolean => {
  return (
    currentSort.value === sortingColumns[index] &&
    currentSortDir.value === "Descending"
  );
};

const sortColumn = (index: number): void => {
  if (!sorting || !sortingColumns) {
    return;
  }

  // Only sort columns where sorting is enabled.
  if (!sortingEnabled(index)) {
    return;
  }

  const columnName = sortingColumns[index];

  if (columnName === currentSort.value) {
    // Reverse sort direction.
    currentSortDir.value =
      currentSortDir.value === SortOrder.Ascending
        ? SortOrder.Descending
        : SortOrder.Ascending;
  } else {
    currentSortDir.value = SortOrder.Ascending;
  }
  currentSort.value = columnName;

  emit("sortColumn", currentSort.value, currentSortDir.value);
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  font-size: 0.875rem;
  padding: 0.875rem 1.125rem;

  background: var(--c-lvl1);
  border-radius: var(--border-radius);
  box-shadow: var(--container-box-shadow);

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
    }

    > .header-title {
      grid-column: 2;
      display: grid;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--c-text);
      align-items: center;
    }

    > .header-actions {
      grid-column: 3;
      align-items: center;

      button {
        border: 0;
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
    }
  }

  ::v-deep(.row) {
    &.expanded {
      > .row-data {
        background: var(--c-lvl1);
        border-bottom-width: 0;
      }
    }
  }

  ::v-deep(.row-details) {
    border-bottom: var(--border-thickness) solid var(--c-lvl4);
  }

  ::v-deep(.row-data) {
    display: grid;
    padding: 0 1rem;
    grid-column-gap: 1rem;
    min-height: 3rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    border-bottom: var(--border-thickness) solid var(--c-lvl4);
    align-items: center;
    font-weight: var(--font-weight);
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
      &:hover {
        background: var(--container-background-hover);
      }

      &:active,
      &.active {
        background: var(--container-background-active);
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
