<template>
  <DataTable
    class="datatable-pools"
    columns-header="1fr auto"
    columns-data="pools-columns-data"
    expand-side="left"
    :rows="rowsPage"
    :columns="['', '', 'Name', 'Volume', 'TVL']"
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
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="pool.tvlUsd"
          :precision="2"
          type="dollar"
        />
      </div>
    </template>

    <!-- Empty for expander arrow and pointer on hover -->
    <template #row-details> &nbsp; </template>
  </DataTable>
</template>

<script setup lang="ts">
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
const rowsPerPage = 20;
const { page, rowsPage, onPage } = usePagination(
  toRef(() => pools),
  rowsPerPage
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-pools {
  container-type: inline-size;

  ::v-deep(.pools-columns-data) {
    --col-width: 11ch;

    display: grid;
    grid-template-columns:
      1rem calc(4 * (26px + 1ch))
      minmax(var(--col-width), 0.75fr) minmax(var(--col-width), 0.75fr)
      minmax(var(--col-width), 0.75fr);

    // Right adjust number columns.
    div:nth-child(4),
    div:nth-child(5) {
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
