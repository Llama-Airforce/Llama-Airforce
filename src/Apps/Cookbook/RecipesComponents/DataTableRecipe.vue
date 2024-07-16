<template>
  <div class="datatables">
    <Recipe title="DataTable">
      <template #example>
        <DataTable
          class="datatable-example"
          columns-header="1fr auto"
          columns-data="example-columns-data"
          :rows="rows"
          :columns="['', 'Deadline', '$/vlCVX', 'Total']"
          :sorting="true"
          :sorting-columns="sortColumns"
          :sorting-columns-enabled="sortColumnsNoEmpty"
          sorting-default-column="deadline"
          sorting-default-dir="desc"
          :loading="isLoading"
          :expanded="expandedRows"
          expand-side="right"
          icon="fa fa-table"
          @sort-column="onSort"
          @selected="onSelected"
        >
          <template #header-content>
            <div class="title">All Rounds</div>
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

          <template #row-details="props: { item: Round }">
            <div>Additional details for round {{ props.item.round }}</div>
          </template>

          <template #row-aggregation>
            <div></div>
            <div></div>
            <div></div>
            <div class="number">
              <AsyncValue
                :value="rows.reduce((acc, x) => acc + x.value * 10000, 0)"
                :precision="2"
                type="dollar"
              />
            </div>
          </template>

          <template #no-data>
            <div>Custom no data message</div>
          </template>
        </DataTable>
      </template>

      <template #snippets>
        <Code
          lang="xml"
          :code="dataTable1"
        ></Code>

        <Code
          lang="typescript"
          :code="dataTable2"
        ></Code>

        <Code
          lang="scss"
          :code="dataTable3"
        ></Code>
      </template>
    </Recipe>

    <Recipe title="DataTable Multiselect">
      <template #example>
        <DataTable
          class="datatable-multiselect"
          columns-header="1fr auto"
          columns-data="multiselect-columns-data"
          :rows="rows"
          :columns="['', 'Deadline', '']"
          @selected="onCheck"
        >
          <template #header-content>
            <div class="title">All Rounds</div>
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

            <div>
              <Checkbox
                :model-value="checked.includes(props.item)"
                @update:model-value="() => onCheck(props.item)"
              />
            </div>
          </template>
        </DataTable>

        <div>Selected: {{ checked.map((x) => x.round).join(", ") }}</div>
      </template>

      <template #snippets>
        <Code
          lang="xml"
          :code="multiselect"
        ></Code>

        <Code
          lang="typescript"
          :code="multiselect2"
        ></Code>
      </template>
    </Recipe>
  </div>
</template>

<script setup lang="ts">
import { orderBy } from "lodash";
import Recipe from "@CB/Recipe.vue";

type Round = {
  round: number;
  value: number;
};

const { sortColumns, sortColumnsNoEmpty, sortColumn, sortOrder, onSort } =
  useSort(["", "deadline", "vlasset", "total"], "total");

const data: Round[] = [
  { round: 1, value: 1 * Math.random() },
  { round: 2, value: 7 * Math.random() },
  { round: 3, value: 5 * Math.random() },
  { round: 4, value: 2 * Math.random() },
  { round: 5, value: 3 * Math.random() },
];

const rows = computed((): Round[] => {
  return orderBy(
    data ?? [],
    (row: Round) => {
      switch (sortColumn.value) {
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
    sortOrder.value
  );
});

const onSelected = (epoch: Round): void => {
  toggleExpand(epoch);
};

// Simulate loading
const isLoading = ref(false);
onMounted(() => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 2000);
});

const expandedRows = ref<Round[]>([]);
const toggleExpand = (round: Round) => {
  const index = expandedRows.value.findIndex((r) => r.round === round.round);
  if (index === -1) {
    expandedRows.value.push(round);
  } else {
    expandedRows.value.splice(index, 1);
  }
};

const dataTable1 = `<DataTable
  class="datatable-example"
  columns-header="1fr auto"
  columns-data="example-columns-data"
  :rows="rows"
  :columns="['', 'Deadline', '$/vlCVX', 'Total']"
  :sorting="true"
  :sorting-columns="sortColumns"
  :sorting-columns-enabled="sortColumnsNoEmpty"
  sorting-default-column="deadline"
  sorting-default-dir="desc"
  :loading="isLoading"
  :expanded="expandedRows"
  expand-side="right"
  icon="fa fa-table"
  @sort-column="onSort"
  @selected="onSelected"
>
  <template #header-content>
    <div class="title">All Rounds</div>
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

  <template #row-aggregation>
    <div></div>
    <div></div>
    <div></div>
    <div class="number">
      <AsyncValue
        :value="rows.reduce((acc, x) => acc + x.value * 10000, 0)"
        :precision="2"
        type="dollar"
      />
    </div>
  </template>
</DataTable>`;

const dataTable2 = `import { orderBy } from "lodash";

type Round = {
  round: number;
  value: number;
};

const { sortColumns, sortColumnsNoEmpty, sortColumn, sortOrder, onSort } =
  useSort(["", "deadline", "vlasset", "total"], "total");

const data: Round[] = [
  { round: 1, value: 1 * Math.random() },
  { round: 2, value: 7 * Math.random() },
  { round: 3, value: 5 * Math.random() },
  { round: 4, value: 2 * Math.random() },
  { round: 5, value: 3 * Math.random() },
];

const rows = computed((): Round[] => {
  return orderBy(
    data ?? [],
    (row: Round) => {
      switch (sortColumn.value) {
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
    sortOrder.value
  );
});

const onSelected = (round: Round): void => {
  console.log(epoch.round);
};`;

const dataTable3 = `.datatable-example {
  .round-number {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  ::v-deep(.example-columns-data) {
    grid-template-columns: 1.5rem 1fr 1fr 1fr 20px;

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

// Multiselect
const checked = ref<Round[]>([]);
const onCheck = (round: Round) => {
  const index = checked.value.indexOf(round);
  if (index === -1) {
    checked.value.push(round);
  } else {
    checked.value.splice(index, 1);
  }
};

const multiselect = `<DataTable
  class="datatable-multiselect"
  columns-header="1fr auto"
  columns-data="multiselect-columns-data"
  :rows="rows"
  :columns="['', 'Deadline', '']"
  @selected="onCheck"
>
  <template #header-content>
    <div class="title">All Rounds</div>
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

    <div>
      <Checkbox
        :model-value="checked.includes(props.item)"
        @update:model-value="() => onCheck(props.item)"
      />
    </div>
  </template>
</DataTable>

<div>Selected: {{ checked.map((x) => x.round).join(", ") }}</div>`;

const multiselect2 = `const checked = ref<Round[]>([]);
const onCheck = (round: Round) => {
  const index = checked.value.indexOf(round);
  if (index === -1) {
    checked.value.push(round);
  } else {
    checked.value.splice(index, 1);
  }
};`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("datatables");

.datatable-example {
  .round-number {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  ::v-deep(.example-columns-data) {
    grid-template-columns: 1.5rem 1fr 1fr 1fr 20px;

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

.datatable-multiselect {
  .round-number {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  ::v-deep(.multiselect-columns-data) {
    grid-template-columns: 1.5rem 1fr auto;
  }
}
</style>
