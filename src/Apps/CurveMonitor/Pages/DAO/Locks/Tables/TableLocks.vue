<script setup lang="ts">
import { useQueryLocksDaily } from "@CM/Services/Dao/Queries";

// Data
const { isFetching: loading, data } = useQueryLocksDaily();

const columns = [
  { id: "day", label: "Day", sort: true } as const,
  { id: "amount", label: "Amount", sort: true, align: "end" } as const,
];

const { sorting, onSort } = useSort<typeof columns>("day");

const rows = computed(() =>
  data.value.orderBy((x) => {
    switch (sorting.value.column) {
      case "day":
        return x.day;
      case "amount":
        return Number(x.amount);
    }
  }, sorting.value.order)
);

function getAmount(item: (typeof rows.value)[number]) {
  return Math.round(Number(item.amount) / 10 ** 18);
}
</script>

<template>
  <Card
    title="Daily Lock Change"
    :loading
  >
    <Table
      :rows
      :columns
      :sorting
      @sort-column="onSort"
    >
      <template #row="{ item }">
        <div>
          {{ new Date(item.day * 1000).toLocaleDateString() }}
        </div>

        <div
          class="end"
          :class="{
            positive: getAmount(item) > 0,
            negative: getAmount(item) < 0,
          }"
        >
          <AsyncValue
            :value="getAmount(item)"
            :precision="2"
          />
        </div>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.table {
  --columns-data: 1fr 1fr;

  .positive {
    color: var(--c-green);
  }

  .negative {
    color: var(--c-red);
  }
}
</style>
