<script setup lang="ts">
import { addressShort } from "@/Wallet";
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
const formatter = (x: number): string =>
  `$${round(Math.abs(x), 1, "dollar")}${unit(x, "dollar")}`;
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
