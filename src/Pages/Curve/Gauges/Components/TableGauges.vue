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
    <template #header-title>
      <div>{{ t("title") }}</div>
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
      <div class="graphs">
        <GraphEmissions
          class="fees-and-emissions"
          :gauge-selected="props.item"
        ></GraphEmissions>
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { $ref, $computed } from "vue/macros";
import { useI18n } from "vue-i18n";
import { orderBy } from "lodash";
import { AsyncValue, DataTable, SortOrder } from "@/Framework";
import { shorten, icon } from "@/Util";
import GraphEmissions from "@/Pages/Curve/Gauges/Components/GraphEmissions.vue";
import Gauge from "@/Pages/Curve/Gauges/Models/Gauge";
import { useCurveStore } from "@/Pages/Curve/Store";

// Props
interface Props {
  expanded?: Gauge[];
}

const { expanded = [] } = defineProps<Props>();

const { t } = useI18n();

// Refs
const store = useCurveStore();

let sortColumn: "name" | "tvl" = $ref("tvl");
let sortOrder: SortOrder = $ref(SortOrder.Descending);

const gauges = $computed((): Gauge[] => {
  return orderBy(
    store.gauges,
    (gauge) => {
      switch (sortColumn) {
        case "name":
          return shorten(gauge.name);
        case "tvl":
          return gauge.tvl;
        default:
          return gauge.tvl;
      }
    },
    sortOrder === SortOrder.Descending ? "desc" : "asc"
  );
});

// Events
const onSort = (columnName: string, order: SortOrder): void => {
  sortColumn = columnName as "name" | "tvl";
  sortOrder = order;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-gauges {
  background: $background-color;

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
    grid-template-columns: 20px 4fr 1fr auto;

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
