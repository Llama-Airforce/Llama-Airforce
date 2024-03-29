<template>
  <DataTable
    class="datatable-pools"
    columns-header="1fr"
    columns-data="pools-columns-data"
    :rows="pools"
    :columns="['', t('name'), t('apr'), t('tvl')]"
    :sorting="true"
    :sorting-columns="['', 'name', 'apr', 'tvl']"
    :sorting-columns-enabled="['name', 'apr', 'tvl']"
    sorting-default-column="tvl"
    sorting-default-dir="Descending"
    :expanded="expanded"
    @sort-column="onSort"
  >
    <template #header-content>
      <div class="title">{{ t("title") }}</div>
    </template>

    <template #row="props: { item: Pool }">
      <div class="logo">
        <img
          class="logo-img"
          :src="icon(props.item.name, false)"
        />
      </div>
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
        class="graphs"
      >
        <GraphTvl
          class="tvl"
          :pool-selected="props.item"
        ></GraphTvl>

        <GraphApr
          class="apr"
          :pool-selected="props.item"
        ></GraphApr>
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { orderBy } from "lodash";
import { AsyncValue, DataTable, SortOrder, useSort } from "@/Framework";
import { shorten, icon, disabled } from "@/Util";
import GraphTvl from "@LAF/Pages/Convex/Pools/Components/GraphTvl.vue";
import GraphApr from "@LAF/Pages/Convex/Pools/Components/GraphApr.vue";
import { type Pool } from "@LAF/Pages/Convex/Pools/Models/Pool";
import { totalApr } from "@LAF/Pages/Convex/Pools/Util/PoolHelper";
import { useConvexStore } from "@LAF/Pages/Convex/Store";

const { t } = useI18n();

// Props
interface Props {
  expanded?: Pool[];
}

const { expanded = [] } = defineProps<Props>();

// Refs
const store = useConvexStore();

type SortColumns = "name" | "apr" | "tvl";
const { sortColumn, sortOrder, onSort } = useSort<SortColumns>("tvl");

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
    sortOrder.value === SortOrder.Descending ? "desc" : "asc"
  );
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-pools {
  background: var(--c-lvl0);

  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .logo-img {
    width: 20px;
    height: 20px;
    object-fit: scale-down;
  }

  ::v-deep(.pools-columns-data) {
    display: grid;
    grid-template-columns: 20px 3fr 2fr 2fr 1rem;

    // Right adjust number columns.
    div:nth-child(3),
    div:nth-child(4) {
      justify-content: end;
    }
  }

  .graphs {
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
