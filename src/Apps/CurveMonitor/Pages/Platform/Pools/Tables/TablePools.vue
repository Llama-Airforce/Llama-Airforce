<script setup lang="ts">
import type { Chain } from "@curvefi/prices-api";
import type { Pool } from "@curvefi/prices-api/pools";

const { pools } = defineProps<{
  chain: Chain;
  pools: Pool[];
}>();

const emit = defineEmits<{
  select: [pool: Pool];
}>();

// Data
const columns = [
  "",
  "",
  { id: "name", label: "Name", sort: true } as const,
  { id: "baseApr", label: "Base APR", sort: true, align: "end" } as const,
  { id: "fees", label: "Fees (24h)", sort: true, align: "end" } as const,
  { id: "volume", label: "Volume (24h)", sort: true, align: "end" } as const,
  { id: "tvl", label: "TVL", sort: true, align: "end" } as const,
  { id: "util", label: "Util", sort: true, align: "end" } as const,
];

const { sorting, onSort } = useSort<typeof columns>("tvl");

const poolsFiltered = computed(() =>
  pools.orderBy((pool) => {
    switch (sorting.value.column) {
      case "name":
        return pool.name;
      case "baseApr":
        return pool.baseDailyApr;
      case "fees":
        return pool.tradingFee24h;
      case "volume":
        return pool.tradingVolume24h;
      case "tvl":
        return pool.tvlUsd;
      case "util":
        return utilRate(pool);
    }
  }, sorting.value.order)
);

const rowsPerPage = 20;
const { page, rowsPage, onPage } = usePagination(poolsFiltered, rowsPerPage);

function utilRate(pool: Pool) {
  return pool.tvlUsd !== 0 ? (100 * pool.tradingVolume24h) / pool.tvlUsd : 0;
}
</script>

<template>
  <Card title="Pools">
    <template #actions>
      <Pagination
        :items-count="pools.length"
        :items-per-page="rowsPerPage"
        :page
        @page="onPage"
      />
    </template>

    <Table
      class="pools-table"
      :rows="rowsPage"
      :columns
      :sorting
      @sort-column="onSort"
      @select="emit('select', $event)"
    >
      <template #row="{ item: pool }">
        <IconExpander />

        <div class="tokens">
          <TokenIcon
            v-for="token of pool.coins"
            :key="token.address"
            :chain
            :address="token.address"
          />
        </div>

        <div>{{ pool.name }}</div>

        <div class="end">
          <AsyncValue
            show-zero
            type="percentage"
            :value="pool.baseDailyApr * 100"
            :precision="2"
          />
        </div>

        <div class="end">
          <AsyncValue
            show-zero
            type="dollar"
            :value="pool.tradingFee24h"
            :precision="2"
          />
        </div>

        <div class="end">
          <AsyncValue
            show-zero
            type="dollar"
            :value="pool.tradingVolume24h"
            :precision="2"
          />
        </div>

        <div class="end">
          <AsyncValue
            show-zero
            type="dollar"
            :value="pool.tvlUsd"
            :precision="2"
          />
        </div>

        <div class="end">
          <AsyncValue
            show-zero
            type="percentage"
            :value="utilRate(pool)"
            :precision="2"
          />
        </div>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.pools-table {
  --col-width: 11ch;
  --columns-data: 1rem calc(4 * (26px + 1ch)) minmax(var(--col-width), 0.75fr)
    minmax(var(--col-width), 0.75fr) minmax(var(--col-width), 0.75fr)
    minmax(var(--col-width), 0.75fr) minmax(var(--col-width), 0.75fr)
    minmax(var(--col-width), 0.5fr);

  .tokens {
    display: grid;
    gap: 1ch;
    grid-template-columns: repeat(4, 26px);
    justify-content: space-between;
    align-items: center;
  }
}
</style>
