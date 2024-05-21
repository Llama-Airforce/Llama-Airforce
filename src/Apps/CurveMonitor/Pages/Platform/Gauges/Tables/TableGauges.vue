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
        class="charts"
      >
        <ChartEmissions
          class="fees-and-emissions"
          :gauge-selected="props.item"
        ></ChartEmissions>
      </div>
      <span v-else></span>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { orderBy } from "lodash";
import { shorten } from "@/Util";
import ChartEmissions from "@CM/Pages/Platform/Gauges/Charts/ChartEmissions.vue";
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
  ::v-deep(.gauges-columns-data) {
    display: grid;
    grid-template-columns: 4fr 1fr 1rem;

    // Right adjust number columns.
    div:nth-child(2),
    div:nth-child(3) {
      justify-content: end;
    }
  }

  .charts {
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
