<template>
  <CardGraph
    class="graph"
    :options="options"
    :series="series"
  >
  </CardGraph>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CardGraph } from "@/Framework";
import { type DataPoint, round, unit } from "@/Util";
import { createChartStyles } from "@/Styles/ChartStyles";
import { getColors, getColorsArray } from "@/Styles/Themes/CM";
import { useSettingsStore } from "@PM/Stores/SettingsStore";
import { type DecimalLabelledSeries } from "@PM/Services/PrismaService";
import { addressShort } from "@/Wallet";

// Props
interface Props {
  data: DecimalLabelledSeries[];
}

const { data = [] } = defineProps<Props>();

// Refs
const storeSettings = useSettingsStore();

const options = computed((): unknown => {
  const colors = getColors(storeSettings.theme);
  const colorsArray = getColorsArray(storeSettings.theme);

  return createChartStyles(
    { colors, colorsArray },
    {
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
            `<div><b>${label}</b>:</div><div>${formatter(value)}</div>`,
          ];

          return data.join("");
        },
      },
      labels: data.map((x) =>
        x.label.length > 10 ? addressShort(x.label) : x.label
      ),
    }
  );
});

const series = computed(() => data.map((x) => x.value));

const categories = computed(() => data.map((x) => x.label));

// Methods
const formatter = (x: number): string =>
  `$${round(Math.abs(x), 1, "dollar")}${unit(x, "dollar")}`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.graph {
  height: 300px;

  ::v-deep(.card-body) {
    .apexcharts-tooltip {
      grid-template-rows: auto auto;
    }
  }
}
</style>
