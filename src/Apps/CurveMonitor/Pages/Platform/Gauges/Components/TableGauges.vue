<template>
  <DataTable
    class="datatable-gauges"
    columns-header="1fr"
    columns-data="gauges-columns-data"
    :rows="gauges"
    :columns="['', t('name'), t('tvl')]"
    :sorting="true"
    :sorting-columns="['', 'name', 'tvl']"
    :sorting-columns-enabled="['name', 'tvl']"
    sorting-default-column="tvl"
    sorting-default-dir="Descending"
    :expanded="expanded"
    @sort-column="onSort"
  >
    <template #header-content>
      <div class="title">{{ t("title") }}</div>
    </template>

    <template #row="props: { item: Gauge }">
      <div class="logo">
        <img
          class="logo-img"
          :src="icon(props.item.name, false)"
        />
      </div>
      <div>{{ shorten(props.item.name) }}</div>

      <div class="number">
        <AsyncValue
          :value="props.item.tvl"
          :precision="1"
          type="dollar"
        />
      </div>
    </template>

    <template #row-details="props: { item: Gauge }">
      <div
        v-if="expanded.includes(props.item)"
        class="graphs"
      >
        <GraphEmissions
          class="fees-and-emissions"
          :gauge-selected="props.item"
        ></GraphEmissions>
      </div>
      <span v-else></span>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { orderBy } from "lodash";
import { AsyncValue, DataTable, SortOrder, useSort } from "@/Framework";
import { shorten, icon } from "@/Util";
import GraphEmissions from "@CM/Pages/Platform/Gauges/Components/GraphEmissions.vue";
import { type Gauge } from "@CM/Pages/Platform/Gauges/Models/Gauge";
import { useCurveStore } from "@CM/Pages/Platform/Store";

// Props
interface Props {
  expanded?: Gauge[];
}

const { expanded = [] } = defineProps<Props>();

const { t } = useI18n();

// Refs
const store = useCurveStore();

type SortColumns = "name" | "tvl";
const { sortColumn, sortOrder, onSort } = useSort<SortColumns>("tvl");

const gauges = computed((): Gauge[] => {
  return orderBy(
    store.gauges,
    (gauge) => {
      switch (sortColumn.value) {
        case "name":
          return shorten(gauge.name);
        case "tvl":
          return gauge.tvl;
        default:
          return gauge.tvl;
      }
    },
    sortOrder.value === SortOrder.Descending ? "desc" : "asc"
  );
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-gauges {
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

  ::v-deep(.gauges-columns-data) {
    display: grid;
    grid-template-columns: 20px 4fr 1fr 1rem;

    // Right adjust number columns.
    div:nth-child(3),
    div:nth-child(4) {
      justify-content: end;
    }
  }

  .graphs {
    display: flex;
    flex-direction: column;
    overflow-y: hidden;

    > .fees-and-emissions {
      height: 400px;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
name: Name
tvl: TVL
title: Curve Pools
</i18n>
