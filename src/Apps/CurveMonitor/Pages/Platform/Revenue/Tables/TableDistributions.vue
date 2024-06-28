<template>
  <DataTable
    class="datatable-distributions"
    columns-header="1fr"
    columns-data="distributions-columns-data"
    :loading
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

    <template #row-aggregation>
      <div></div>
      <div></div>
      <div></div>

      <div class="number">
        <AsyncValue
          :value="rows.reduce((acc, x) => acc + x.feesUsd, 0)"
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
import { useQueryDistributions } from "@CM/Services/Revenue/Queries";

const { t } = useI18n();

type Row = Distribution;

// Data
const { sortColumns, sortColumn, sortOrder, onSort } = useSort(
  ["timestamp", "fees"],
  "timestamp"
);

const rows = computed(() =>
  chain(rowsRaw.value)
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

const { isFetching: loading, data: rowsRaw } = useQueryDistributions();

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
    display: grid;
    grid-template-columns: 1fr 1fr;

    @media only screen and (max-width: 1280px) {
    }

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
