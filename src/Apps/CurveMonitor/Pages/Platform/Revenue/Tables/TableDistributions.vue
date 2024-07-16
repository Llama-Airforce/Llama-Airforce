<template>
  <DataTable
    class="datatable-distributions"
    columns-header="1fr"
    columns-data="distributions-columns-data"
    :rows
    :columns="['Date', 'Fees']"
    :sorting="true"
    :sorting-columns="sortColumns"
    :sorting-columns-enabled="sortColumns"
    sorting-default-column="timestamp"
    sorting-default-dir="desc"
    @sort-column="onSort"
  >
    <template #header-content>
      <div class="title">{{ t("title") }}</div>
    </template>

    <template #row="{ item: { timestamp, feesUsd } }: { item: Row }">
      <div>{{ formatDate(timestamp) }}</div>

      <div class="number">
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
const { sortColumns, sortColumn, sortOrder, onSort } = useSort(
  ["timestamp", "fees"],
  "timestamp"
);

const rows = computed(() =>
  chain(distributions)
    .orderBy((distribution) => {
      switch (sortColumn.value) {
        case "timestamp":
          return distribution.timestamp;
        case "fees":
          return distribution.feesUsd;
        default:
          return distribution.timestamp;
      }
    }, sortOrder.value)
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
  ::v-deep(.distributions-columns-data) {
    grid-template-columns: 1fr 1fr;

    // Right adjust number columns.
    div:nth-child(2) {
      justify-content: end;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Distributions
</i18n>
