<template>
  <Card :title="t('title')">
    <template #actions>
      <Pagination
        :items-count="pools.length"
        :items-per-page="rowsPerPage"
        :page="page"
        @page="onPage"
      ></Pagination>
    </template>

    <Table
      class="pools-table"
      expand-side="left"
      :rows="rowsPage"
      :columns
      :sorting
      @sort-column="onSort"
      @selected="emit('selected', $event)"
    >
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

        <div class="end">
          <AsyncValue
            :value="pool.tradingVolume24h"
            :precision="2"
            :show-zero="true"
            type="dollar"
          />
        </div>

        <div class="end">
          <AsyncValue
            :value="pool.tvlUsd"
            :precision="2"
            :show-zero="true"
            type="dollar"
          />
        </div>

        <div class="end">
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
    </Table>
  </Card>
</template>

<script setup lang="ts">
import { chain as chain_ } from "lodash";
import { type Chain } from "@CM/Models/Chain";
import { type Pool } from "@CM/Services/Pools";

type Row = Pool;

const { t } = useI18n();

// Emit
const emit = defineEmits<{
  selected: [pool: Row];
}>();

// Props
interface Props {
  chain: Chain;
  pools: Pool[];
}

const { pools } = defineProps<Props>();

// Data
const columns = [
  "",
  "",
  { id: "name", label: "Name", sort: true } as const,
  { id: "volume", label: "Volume (24h)", sort: true, align: "end" } as const,
  { id: "tvl", label: "TVL", sort: true, align: "end" } as const,
  { id: "util", label: "Util", sort: true, align: "end" } as const,
];

const { sorting, onSort } = useSort<typeof columns>("tvl");

const poolsFiltered = computed(() =>
  chain_(pools)
    .orderBy((pool) => {
      switch (sorting.value.column) {
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
    }, sorting.value.order)
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

.pools-table {
  --col-width: 11ch;
  --columns-data: 1rem calc(4 * (26px + 1ch)) minmax(var(--col-width), 0.75fr)
    minmax(var(--col-width), 0.75fr) minmax(var(--col-width), 0.75fr)
    minmax(var(--col-width), 0.5fr);

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
