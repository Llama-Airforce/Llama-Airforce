<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStyles";
import { useSettingsStore } from "@PM/Stores";
import { type DecimalLabelledSeries } from "@PM/Services";

// Props
interface Props {
  data: DecimalLabelledSeries[];
}

const { data = [] } = defineProps<Props>();

// Refs
const { theme } = storeToRefs(useSettingsStore());

const options = computed(() => {
  return createChartStyles(theme.value, {
    chart: {
      id: "distribution",
      type: "bar",
      animations: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: categories.value,
      labels: {
        rotate: -45,
      },
      tickPlacement: "on",
    },
    legend: {
      inverseOrder: true,
    },
    stroke: {
      width: 0.5,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      followCursor: false,
      enabled: true,
      intersect: true,
    },
  });
});

const series = computed((): { name: string; data: number[] }[] => [
  {
    name: "# of troves",
    data: Object.values(data).map((x) => x.value),
  },
]);

const categories = computed(() => data.map((x) => x.label));
</script>

<template>
  <CardChart
    class="graph"
    :options="options"
    :series="series"
  >
  </CardChart>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.graph {
  :deep(.card-body) {
    height: 300px;

    .apexcharts-tooltip {
      grid-template-rows: auto auto;
    }
  }
}
</style>
