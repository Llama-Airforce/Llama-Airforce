<script setup lang="ts">
import type { Distribution } from "@CM/Services/revenue";

const { distributions } = defineProps<{
  distributions: Distribution[];
}>();

// Data
const columns = [
  { id: "timestamp", label: "Date", sort: true } as const,
  { id: "fees", label: "Fees", sort: true, align: "end" } as const,
];

const { sorting, onSort } = useSort<typeof columns>("timestamp");

const rows = computed(() =>
  distributions.orderBy((distribution) => {
    switch (sorting.value.column) {
      case "timestamp":
        return distribution.timestamp;
      case "fees":
        return distribution.feesUsd;
    }
  }, sorting.value.order)
);

// Formatters
function formatDate(epoch: number): string {
  const date = new Date(epoch * 1000); // Convert seconds to milliseconds
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
</script>

<template>
  <Card title="Distributions">
    <Table
      class="distributions-table"
      :rows
      :columns
      :sorting
      @sort-column="onSort"
    >
      <template #row="{ item: { timestamp, feesUsd } }">
        <div>{{ formatDate(timestamp) }}</div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="feesUsd"
            :precision="2"
          />
        </div>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.distributions-table {
  --columns-data: 1fr 1fr;
}
</style>
