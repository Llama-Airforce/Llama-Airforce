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

const rows = computed(() =>
  data.orderBy((row) => {
    switch (sorting.value.column) {
      case "deadline":
        return row.round;
      case "vlasset":
        return row.value;
      case "total":
        return row.value;
    }
  }, sorting.value.order)
);

const expandedRows = ref<Round[]>([]);
const toggleExpand = (round: Round) => {
  const index = expandedRows.value.findIndex((r) => r.round === round.round);
  if (index === -1) {
    expandedRows.value.push(round);
  } else {
    expandedRows.value.splice(index, 1);
  }
};

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

// Manual
const checkedManual = ref<Round[]>([]);
const onCheckManual = (round: Round) => {
  const index = checkedManual.value.indexOf(round);
  if (index === -1) {
    checkedManual.value.push(round);
  } else {
    checkedManual.value.splice(index, 1);
  }
};
</script>

<template>
  <div class="dashboard">
    <Recipe title="Table">
      <template #example>
        <Table
          class="example-table"
          :rows
          :columns
          :sorting
          :expanded="expandedRows"
          @sort-column="onSort"
          @select="toggleExpand"
        >
          <template #row="{ item, expanded }">
            <div
              class="round-number"
              @click.stop
            >
              <a class="vote-link">
                {{ item.round }}
              </a>
            </div>

            <div>
              {{ new Date(Date.now()).toLocaleDateString() }}
            </div>

            <div class="end">
              <AsyncValue
                type="dollar"
                :value="item.value"
                :precision="5"
              />
            </div>

            <div class="end">
              <AsyncValue
                type="dollar"
                :value="item.value * 10000"
                :precision="2"
              />
            </div>

            <IconExpander :expanded />
          </template>

          <template #row-details="{ item }">
            <div>Additional details for round {{ item.round }}</div>
          </template>

          <template #row-aggregation>
            <div></div>
            <div></div>
            <div></div>
            <div class="end">
              <AsyncValue
                type="dollar"
                :value="rows.sumBy((x) => x.value * 10000)"
                :precision="2"
              />
            </div>
          </template>
        </Table>
      </template>
    </Recipe>

    <Recipe title="Table Multiselect">
      <template #example>
        <Table
          class="multiselect-table"
          :rows
          :columns="['', 'Deadline', '']"
          @select="onCheck"
        >
          <template #row="{ item }">
            <div
              class="round-number"
              @click.stop
            >
              <a class="vote-link">
                {{ item.round }}
              </a>
            </div>

            <div>
              {{ new Date(Date.now()).toLocaleDateString() }}
            </div>

            <div class="center">
              <Checkbox
                :model-value="checked.includes(item)"
                @update:model-value="() => onCheck(item)"
              />
            </div>
          </template>
        </Table>

        <div>Selected: {{ checked.map((x) => x.round).join(", ") }}</div>
      </template>
    </Recipe>

    <Recipe title="Table Manual Rows">
      <template #example>
        <Table
          class="multiselect-table"
          :columns="['', 'Deadline', '']"
        >
          <TableRow
            selectable
            :data="rows[0]"
            @select="onCheckManual"
          >
            <div
              class="round-number"
              @click.stop
            >
              <a class="vote-link">
                {{ rows[0].round }}
              </a>
            </div>

            <div>
              {{ new Date(Date.now()).toLocaleDateString() }}
            </div>

            <div class="center">
              <Checkbox
                :model-value="checkedManual.includes(rows[0])"
                @update:model-value="() => onCheckManual(rows[0])"
              />
            </div>
          </TableRow>

          <TableRow
            selectable
            :data="rows[1]"
            @select="onCheckManual"
          >
            <div
              class="round-number"
              @click.stop
            >
              <a class="vote-link">
                {{ rows[1].round }}
              </a>
            </div>

            <div>
              {{ new Date(Date.now()).toLocaleDateString() }}
            </div>

            <div class="center">
              <Checkbox
                :model-value="checkedManual.includes(rows[1])"
                @update:model-value="() => onCheckManual(rows[1])"
              />
            </div>
          </TableRow>
        </Table>

        <div>Selected: {{ checkedManual.map((x) => x.round).join(", ") }}</div>
      </template>
    </Recipe>
  </div>
</template>

<style scoped>
.round-number {
  display: flex;
  justify-content: center;
  align-items: center;
}

.example-table {
  --columns-data: 1.5rem 1fr 1fr 1fr 20px;

  .vote-link {
    width: 1.5rem;
    text-align: center;
  }
}

.multiselect-table {
  --columns-data: 1.5rem 1fr auto;
}

.manual-table {
  --columns-data: 1.5rem 1fr auto;
}
</style>
