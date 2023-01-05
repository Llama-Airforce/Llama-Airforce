<template>
  <div class="data-table">
    <div class="dashboard">
      <DataTable
        class="datatable-example"
        columns-header="1fr"
        columns-data="example-columns-data"
        :rows="rows"
        :columns="['', 'Deadline', '$/vlCVX', 'Total']"
        :sorting="true"
        :sorting-columns="['', 'deadline', 'vlasset', 'total']"
        :sorting-columns-enabled="['deadline', 'vlasset', 'total']"
        sorting-default-column="deadline"
        sorting-default-dir="Descending"
        @sort-column="onSort"
        @selected="onSelected"
      >
        <template #header-title>
          <div>All Rounds</div>
        </template>

        <template #header-actions>
          <Tooltip>Tooltip data goes here</Tooltip>
        </template>

        <template #row="props: { item: Round }">
          <div
            class="round-number"
            @click.stop
          >
            <a class="vote-link">
              {{ props.item.round }}
            </a>
          </div>
          <div>
            {{ new Date(Date.now()).toLocaleDateString() }}
          </div>
          <div class="number">
            <AsyncValue
              :value="props.item.value"
              :precision="5"
              type="dollar"
            />
          </div>
          <div class="number">
            <AsyncValue
              :value="props.item.value * 10000"
              :precision="2"
              type="dollar"
            />
          </div>
        </template>
      </DataTable>

      <Code
        lang="xml"
        :code="dataTable1"
      />

      <Code
        lang="typescript"
        :code="dataTable2"
      />

      <Code
        lang="scss"
        :code="dataTable3"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { $ref, $computed } from "vue/macros";
import AsyncValue from "@/Framework/AsyncValue.vue";
import DataTable from "@/Framework/DataTable.vue";
import Code from "@/Framework/Code.vue";
import Tooltip from "@/Framework/Tooltip.vue";
import { SortOrder } from "@/Framework/SortOrder";
import { orderBy } from "lodash";

type Round = {
  round: number;
  value: number;
};

let sortColumn: "deadline" | "vlasset" | "total" = $ref("deadline");
let sortOrder: SortOrder = $ref(SortOrder.Descending);

const data: Round[] = [
  { round: 1, value: 1 * Math.random() },
  { round: 2, value: 7 * Math.random() },
  { round: 3, value: 5 * Math.random() },
  { round: 4, value: 2 * Math.random() },
  { round: 5, value: 3 * Math.random() },
];

const rows = $computed((): Round[] => {
  return orderBy(
    data ?? [],
    (row: Round) => {
      switch (sortColumn) {
        case "deadline":
          return row.round;
        case "vlasset":
          return row.value;
        case "total":
          return row.value;
        default:
          return row.round;
      }
    },
    sortOrder === SortOrder.Descending ? "desc" : "asc"
  );
});

// Events
const onSort = (columnName: string, order: SortOrder): void => {
  sortColumn = columnName as "deadline" | "vlasset" | "total";
  sortOrder = order;
};

const onSelected = (data: unknown): void => {
  const epoch = data as Round;
  console.log(epoch.round);
};

const dataTable1 = `<DataTable
  class="datatable-example"
  columns-header="1fr"
  columns-data="example-columns-data"
  :rows="rows"
  :columns="['', 'Deadline', '$/vlCVX', 'Total']"
  :sorting="true"
  :sorting-columns="['', 'deadline', 'vlasset', 'total']"
  :sorting-columns-enabled="['deadline', 'vlasset', 'total']"
  sorting-default-column="deadline"
  sorting-default-dir="Descending"
  @sort-column="onSort"
  @selected="onSelected"
>
  <template #header-title>
    <div>All Rounds</div>
  </template>

  <template #header-actions>
    <Tooltip>Tooltip data goes here</Tooltip>
  </template>

  <template #row="props: { item: Round }">
    <div
      class="round-number"
      @click.stop
    >
      <a class="vote-link">
        {{ props.item.round }}
      </a>
    </div>
    <div>
      {{ new Date(Date.now()).toLocaleDateString() }}
    </div>
    <div class="number">
      <AsyncValue
        :value="props.item.value"
        :precision="5"
        type="dollar"
      />
    </div>
    <div class="number">
      <AsyncValue
        :value="props.item.value * 10000"
        :precision="2"
        type="dollar"
      />
    </div>
  </template>
</DataTable>`;

const dataTable2 = `import { $ref, $computed } from "vue/macros";
import AsyncValue from "@/Framework/AsyncValue.vue";
import DataTable from "@/Framework/DataTable.vue";
import Tooltip from "@/Framework/Tooltip.vue";
import { SortOrder } from "@/Framework/SortOrder";
import { orderBy } from "lodash";

type Round = {
  round: number;
  value: number;
};

let sortColumn: "deadline" | "vlasset" | "total" = $ref("deadline");
let sortOrder: SortOrder = $ref(SortOrder.Descending);

const data: Round[] = [
  { round: 1, value: 1 * Math.random() },
  { round: 2, value: 7 * Math.random() },
  { round: 3, value: 5 * Math.random() },
  { round: 4, value: 2 * Math.random() },
  { round: 5, value: 3 * Math.random() },
];

const rows = $computed((): Round[] => {
  return orderBy(
    data ?? [],
    (row: Round) => {
      switch (sortColumn) {
        case "deadline":
          return row.round;
        case "vlasset":
          return row.value;
        case "total":
          return row.value;
        default:
          return row.round;
      }
    },
    sortOrder === SortOrder.Descending ? "desc" : "asc"
  );
});

// Events
const onSort = (columnName: string, order: SortOrder): void => {
  sortColumn = columnName as "deadline" | "vlasset" | "total";
  sortOrder = order;
};

const onSelected = (data: unknown): void => {
  const epoch = data as Round;
  console.log(epoch.round);
};`;

const dataTable3 = `.datatable-example {
  .round-number {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  ::v-deep(.example-columns-data) {
    display: grid;
    grid-template-columns: 1.5rem 1fr 1fr 1fr;

    // Right adjust number columns.
    div:nth-child(3),
    div:nth-child(4) {
      justify-content: end;
    }

    .vote-link {
      width: 1.5rem;
      text-align: center;
    }
  }
}`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
@import "@/Pages/Cookbook/Cookbook.scss";

@include dashboard("data-table");

.data-table {
  .dashboard {
    @include cookbook-item;

    ::v-deep(pre) {
      margin: 0;
      margin-top: 1.5rem;
    }
  }
}

.datatable-example {
  .round-number {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  ::v-deep(.example-columns-data) {
    display: grid;
    grid-template-columns: 1.5rem 1fr 1fr 1fr;

    // Right adjust number columns.
    div:nth-child(3),
    div:nth-child(4) {
      justify-content: end;
    }

    .vote-link {
      width: 1.5rem;
      text-align: center;
    }
  }
}
</style>
