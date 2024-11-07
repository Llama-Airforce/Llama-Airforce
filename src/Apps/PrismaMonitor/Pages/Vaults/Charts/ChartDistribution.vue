<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStylesApex";
import type { DecimalLabelledSeries } from "@PM/Services";

const { data = [] } = defineProps<{
  data: DecimalLabelledSeries[];
}>();

const options = computed(() => {
  return createChartStyles({
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
  <Card>
    <ChartApex
      :options
      :series
    />
  </Card>
</template>

<style scoped>
.chart {
  height: 300px;
}
</style>
