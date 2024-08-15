<template>
  <div class="tables">
    <Recipe title="Table">
      <template #example>
        <Table
          class="example-table"
          :rows
          :columns
          :sorting
          :expanded="expandedRows"
          expand-side="right"
          @sort-column="onSort"
          @selected="onSelected"
        >
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

            <div class="end">
              <AsyncValue
                :value="props.item.value"
                :precision="5"
                type="dollar"
              />
            </div>

            <div class="end">
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
            <div class="end">
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
        </Table>
      </template>

      <template #snippets>
        <Code
          lang="xml"
          :code="table1"
        ></Code>

        <Code
          lang="typescript"
          :code="table2"
        ></Code>

        <Code
          lang="scss"
          :code="table3"
        ></Code>
      </template>
    </Recipe>

    <Recipe title="Table Multiselect">
      <template #example>
        <Table
          class="multiselect-table"
          :rows="rows"
          :columns="['', 'Deadline', '']"
          @selected="onCheck"
        >
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

            <div class="center">
              <Checkbox
                :model-value="checked.includes(props.item)"
                @update:model-value="() => onCheck(props.item)"
              />
            </div>
          </template>
        </Table>

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
import Recipe from "@CB/Recipe.vue";

type Round = {
  round: number;
  value: number;
};

const columns = [
  "",
  { id: "deadline", label: "Deadline", sort: true } as const,
  { id: "vlasset", label: "$/vlCVX", sort: true, align: "end" } as const,
  { id: "total", label: "Total", sort: true, align: "end" } as const,
];

const { sorting, onSort } = useSort<typeof columns>("total");

const data: Round[] = [
  { round: 1, value: 1 * Math.random() },
  { round: 2, value: 7 * Math.random() },
  { round: 3, value: 5 * Math.random() },
  { round: 4, value: 2 * Math.random() },
  { round: 5, value: 3 * Math.random() },
];

const rows = computed(() => {
  return data.orderBy((row) => {
    switch (sorting.value.column) {
      case "deadline":
        return row.round;
      case "vlasset":
        return row.value;
      case "total":
        return row.value;
      default:
        return row.round;
    }
  }, sorting.value.order);
});

const onSelected = (epoch: Round): void => {
  toggleExpand(epoch);
};

const expandedRows = ref<Round[]>([]);
const toggleExpand = (round: Round) => {
  const index = expandedRows.value.findIndex((r) => r.round === round.round);
  if (index === -1) {
    expandedRows.value.push(round);
  } else {
    expandedRows.value.splice(index, 1);
  }
};

const table1 = `<Table
  class="example-table"
  :rows
  :columns
  :sorting
  :expanded="expandedRows"
  expand-side="right"
  icon="fa fa-table"
  @sort-column="onSort"
  @selected="onSelected"
>
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

    <div class="end">
      <AsyncValue
        :value="props.item.value"
        :precision="5"
        type="dollar"
      />
    </div>

    <div class="end">
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
    <div class="end">
      <AsyncValue
        :value="rows.reduce((acc, x) => acc + x.value * 10000, 0)"
        :precision="2"
        type="dollar"
      />
    </div>
  </template>
</Table>`;

const table2 = `type Round = {
  round: number;
  value: number;
};

const columns = [
  "",
  { id: "deadline", label: "Deadline", sort: true } as const,
  { id: "vlasset", label: "$/vlCVX", sort: true, align: "end" } as const,
  { id: "total", label: "Total", sort: true, align: "end" } as const,
];

const { sorting, onSort } = useSort<typeof columns>("total");

const data: Round[] = [
  { round: 1, value: 1 * Math.random() },
  { round: 2, value: 7 * Math.random() },
  { round: 3, value: 5 * Math.random() },
  { round: 4, value: 2 * Math.random() },
  { round: 5, value: 3 * Math.random() },
];

const rows = computed(() => {
  return data.orderBy((row) => {
    switch (sorting.value.column) {
      case "deadline":
        return row.round;
      case "vlasset":
        return row.value;
      case "total":
        return row.value;
      default:
        return row.round;
    }
  }, sorting.value.order);
});

const onSelected = (round: Round): void => {
  console.log(epoch.round);
};`;

const table3 = `.example-table {
  --columns-data: 1.5rem 1fr 1fr 1fr 20px;

  .round-number {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .vote-link {
    width: 1.5rem;
    text-align: center;
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

const multiselect = `<Table
  class="multiselect-table"
  :rows="rows"
  :columns="['', 'Deadline', '']"
  @selected="onCheck"
>
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
</Table>

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

@include dashboard("tables");

.example-table {
  --columns-data: 1.5rem 1fr 1fr 1fr 20px;

  .round-number {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .vote-link {
    width: 1.5rem;
    text-align: center;
  }
}

.multiselect-table {
  --columns-data: 1.5rem 1fr auto;

  .round-number {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
