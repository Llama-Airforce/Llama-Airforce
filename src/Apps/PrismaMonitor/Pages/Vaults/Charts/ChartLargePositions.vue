<script setup lang="ts">
import { addressShort } from "@/Wallet";
import { createChartStyles } from "@/Styles/ChartStylesApex";
import { type DecimalLabelledSeries } from "@PM/Services";

const { data = [] } = defineProps<{
  data: DecimalLabelledSeries[];
}>();

const options = computed(() => {
  return createChartStyles({
    chart: {
      id: "largePositions",
      type: "donut",
      animations: {
        enabled: false,
      },
    },
    legend: {
      inverseOrder: true,
    },
    stroke: {
      width: 0.5,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      custom: (x: DataPoint<number>) => {
        let label = categories.value[x.seriesIndex];
        label = label.length > 10 ? addressShort(label) : label;
        const value = x.series[x.seriesIndex];
        const data = [
          `<div><b>${label}</b>:</div><div>${formatter(
            value as unknown as number
          )}</div>`,
        ];

        return data.join("");
      },
    },
    labels: data.map((x) =>
      x.label.length > 10 ? addressShort(x.label) : x.label
    ),
  });
});

const series = computed(() => data.map((x) => x.value));

const categories = computed(() => data.map((x) => x.label));

// Methods
const formatter = (x: number) =>
  `$${round(Math.abs(x), 1, "dollar")}${unit(x)}`;
</script>

<template>
  <Card>
    <ChartApex
      :options
      :series
    ></ChartApex>
  </Card>
</template>

<style scoped>
.chart {
  height: 300px;
}
</style>
