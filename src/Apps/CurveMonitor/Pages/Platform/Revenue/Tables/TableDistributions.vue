<template>
  <DataTable
    class="datatable-distributions"
    :rows
    :columns
    :sorting
    @sort-column="onSort"
  >
    <template #header-content>
      <div class="title">{{ t("title") }}</div>
    </template>

    <template #row="{ item: { timestamp, feesUsd } }: { item: Row }">
      <div>{{ formatDate(timestamp) }}</div>

      <div class="end">
        <AsyncValue
          :value="feesUsd"
          :precision="2"
          type="dollar"
        />
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import { type Distribution } from "@CM/Services/Revenue";

const { t } = useI18n();

type Row = Distribution;

// Props
interface Props {
  distributions: Distribution[];
}

const { distributions } = defineProps<Props>();

// Data
const columns = [
  { id: "timestamp", label: "Date", sort: true } as const,
  { id: "fees", label: "Fees", sort: true, align: "end" } as const,
];

const { sorting, onSort } = useSort<typeof columns>("timestamp");

const rows = computed(() =>
  chain(distributions)
    .orderBy((distribution) => {
      switch (sorting.value.column) {
        case "timestamp":
          return distribution.timestamp;
        case "fees":
          return distribution.feesUsd;
        default:
          return distribution.timestamp;
      }
    }, sorting.value.order)
    .value()
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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-distributions {
  --columns-data: 1fr 1fr;
}
</style>

<i18n lang="yaml" locale="en">
title: Distributions
</i18n>
