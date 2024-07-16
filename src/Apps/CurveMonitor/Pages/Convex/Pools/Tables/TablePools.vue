<template>
  <DataTable
    class="datatable-pools"
    columns-header="1fr"
    columns-data="pools-columns-data"
    :rows="pools"
    :columns="['', t('name'), t('apr'), t('tvl')]"
    :sorting="true"
    :sorting-columns="sortColumns"
    :sorting-columns-enabled="sortColumnsNoEmpty"
    sorting-default-column="tvl"
    sorting-default-dir="desc"
    :expanded="expanded"
    @sort-column="onSort"
  >
    <template #header-content>
      <div class="title">{{ t("title") }}</div>
    </template>

    <template #row="props: { item: Pool }">
      <div>{{ shorten(props.item.name) }}</div>
      <div class="number">
        <AsyncValue
          :value="totalApr(props.item) * 100"
          :precision="1"
          type="percentage"
        />
      </div>
      <div class="number">
        <AsyncValue
          :value="props.item.tvl"
          :precision="1"
          type="dollar"
        />
      </div>
    </template>

    <template #row-details="props: { item: Pool }">
      <div
        v-if="expanded.includes(props.item)"
        class="charts"
      >
        <ChartTvl
          class="tvl"
          :pool-selected="props.item"
        ></ChartTvl>

        <ChartApr
          class="apr"
          :pool-selected="props.item"
        ></ChartApr>
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { orderBy } from "lodash";
import { shorten, disabled } from "@/Util";
import { ChartTvl, ChartApr } from "@CM/Pages/Convex/Pools/Charts";
import { type Pool } from "@CM/Pages/Convex/Pools/Models/Pool";
import { totalApr } from "@CM/Pages/Convex/Pools/Util/PoolHelper";
import { useConvexStore } from "@CM/Pages/Convex/Store";

const { t } = useI18n();

// Props
interface Props {
  expanded?: Pool[];
}

const { expanded = [] } = defineProps<Props>();

// Refs
const store = useConvexStore();

const { sortColumn, sortColumns, sortColumnsNoEmpty, sortOrder, onSort } =
  useSort(["", "name", "apr", "tvl"], "tvl");

const pools = computed((): Pool[] => {
  return orderBy(
    store.pools.filter((pool) => !disabled(pool.name)),
    (pool) => {
      switch (sortColumn.value) {
        case "name":
          return shorten(pool.name);
        case "apr":
          return totalApr(pool);
        case "tvl":
          return pool.tvl;
        default:
          return pool.tvl;
      }
    },
    sortOrder.value
  );
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-pools {
  background: var(--c-lvl0);

  ::v-deep(.pools-columns-data) {
    grid-template-columns: 3fr 2fr 2fr 1rem;

    // Right adjust number columns.
    div:nth-child(2),
    div:nth-child(3) {
      justify-content: end;
    }
  }

  .charts {
    display: flex;
    flex-direction: column;
    background: var(--c-lvl1);
    overflow-y: hidden;

    > .tvl {
      height: 400px;
    }

    > .apr {
      height: 400px;
      padding-top: 1.5rem;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Convex Pools
name: Name
tvl: TVL
apr: APR
</i18n>
