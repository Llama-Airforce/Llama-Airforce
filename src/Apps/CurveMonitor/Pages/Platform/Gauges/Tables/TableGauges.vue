<template>
  <Card :title="t('title')">
    <DataTable
      class="datatable-gauges"
      :rows="gauges"
      :columns
      :sorting
      :expanded="expanded"
      @sort-column="onSort"
      @selected="emit('selected', $event)"
    >
      <template #row="props: { item: Gauge }">
        <div>{{ shorten(props.item.name) }}</div>

        <div class="end">
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
  </Card>
</template>

<script setup lang="ts">
import { orderBy } from "lodash";
import { shorten } from "@/Util";
import ChartEmissions from "@CM/Pages/Platform/Gauges/Charts/ChartEmissions.vue";
import { type Gauge } from "@CM/Pages/Platform/Gauges/Models/Gauge";
import { useCurveStore } from "@CM/Pages/Platform/Store";

// Emit
const emit = defineEmits<{
  selected: [market: Gauge];
}>();

// Props
interface Props {
  expanded?: Gauge[];
}

const { expanded = [] } = defineProps<Props>();

const { t } = useI18n();

// Refs
const store = useCurveStore();

const columns = computed(() => [
  "",
  { id: "name" as const, label: t("name"), sort: true as const },
  {
    id: "tvl" as const,
    label: t("tvl"),
    sort: true as const,
    align: "end" as const,
  },
]);

const { sorting, onSort } = useSort<typeof columns.value>("tvl");

const gauges = computed((): Gauge[] => {
  return orderBy(
    store.gauges,
    (gauge) => {
      switch (sorting.value.column) {
        case "name":
          return shorten(gauge.name);
        case "tvl":
          return gauge.tvl;
        default:
          return gauge.tvl;
      }
    },
    sorting.value.order
  );
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-gauges {
  --columns-data: 4fr 1fr 1rem;

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
