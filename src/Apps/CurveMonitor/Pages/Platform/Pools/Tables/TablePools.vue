<template>
  <DataTable
    class="datatable-pools"
    expand-side="left"
    :rows="rowsPage"
    :columns="['', '', 'Name', 'Volume (24h)', 'TVL', 'Util Rate']"
    :sorting="{
      columns: sortColumns,
      enabled: sortColumnsNoEmpty,
      default: 'tvl',
      defaultDir: 'desc',
    }"
    @sort-column="onSort"
  >
    <template #header-content>
      <div class="title">{{ t("title") }}</div>

      <div style="display: flex; gap: 1rem">
        <Pagination
          class="pagination"
          :items-count="pools.length"
          :items-per-page="rowsPerPage"
          :page="page"
          @page="onPage"
        ></Pagination>
      </div>
    </template>

    <template #row="{ item: pool }: { item: Row }">
      <div class="tokens">
        <TokenIcon
          v-for="token of pool.coins"
          :key="token.address"
          :chain
          :address="token.address"
        ></TokenIcon>
      </div>

      <div>{{ pool.name }}</div>

      <div class="number">
        <AsyncValue
          :value="pool.tradingVolume24h"
          :precision="2"
          :show-zero="true"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="pool.tvlUsd"
          :precision="2"
          :show-zero="true"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="utilRate(pool)"
          :precision="2"
          :show-zero="true"
          type="percentage"
        />
      </div>
    </template>

    <!-- Empty for expander arrow and pointer on hover -->
    <template #row-details> &nbsp; </template>
  </DataTable>
</template>

<script setup lang="ts">
import { chain as chain_ } from "lodash";
import { type Chain } from "@CM/Models/Chain";
import { type Pool } from "@CM/Services/Pools";

type Row = Pool;

const { t } = useI18n();

// Props
interface Props {
  chain: Chain;
  pools: Pool[];
}

const { pools } = defineProps<Props>();

// Data
const { sortColumns, sortColumnsNoEmpty, sortColumn, sortOrder, onSort } =
  useSort(["", "", "name", "volume", "tvl", "util"], "tvl");

const poolsFiltered = computed(() =>
  chain_(pools)
    .orderBy((pool) => {
      switch (sortColumn.value) {
        case "name":
          return pool.name;
        case "volume":
          return pool.tradingVolume24h;
        case "tvl":
          return pool.tvlUsd;
        case "util":
          return utilRate(pool);
        default:
          return pool.tvlUsd;
      }
    }, sortOrder.value)
    .value()
);

const rowsPerPage = 20;
const { page, rowsPage, onPage } = usePagination(poolsFiltered, rowsPerPage);

function utilRate(pool: Pool) {
  return pool.tvlUsd !== 0 ? (100 * pool.tradingVolume24h) / pool.tvlUsd : 0;
}
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-pools {
  --columns-header: 1fr auto;

  --col-width: 11ch;
  --columns-data: 1rem calc(4 * (26px + 1ch)) minmax(var(--col-width), 0.75fr)
    minmax(var(--col-width), 0.75fr) minmax(var(--col-width), 0.75fr)
    minmax(var(--col-width), 0.5fr);

  :deep(.row-data) {
    // Right adjust number columns.
    div:nth-child(4),
    div:nth-child(5),
    div:nth-child(6) {
      justify-content: end;
    }
  }

  .tokens {
    display: grid;
    gap: 1ch;
    grid-template-columns: repeat(4, 26px);
    justify-content: space-between;
    align-items: center;

    img {
      aspect-ratio: 1;
      max-width: 100%;
      object-fit: contain;
      border-radius: 50%;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Pools
</i18n>
