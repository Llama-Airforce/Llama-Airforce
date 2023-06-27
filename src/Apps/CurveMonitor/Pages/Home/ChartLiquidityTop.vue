<template>
  <CardGraph
    class="chart"
    title="Liquidity Usage"
    :loading="loading"
    :options="options"
    :series="series"
  ></CardGraph>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { CardGraph } from "@/Framework";
import { createChartStyles } from "@/Styles/ChartStyles";
import { getColors, getColorsArray } from "@/Styles/Themes/CM";
import { type DataPoint, round } from "@/Util";
import { getHost } from "@/Services/Host";
import CurveService from "@CM/Pages/Home/Services/CurveService";
import { useSettingsStore } from "@CM/Stores/SettingsStore";

const curveService = new CurveService(getHost());

// Refs
const storeSettings = useSettingsStore();

const loading = ref(true);
const data = ref<{ name: string; liq_use: number }[]>([]);

// eslint-disable-next-line max-lines-per-function
const options = computed((): unknown => {
  const colors = getColors(storeSettings.theme);
  const colorsArray = getColorsArray(storeSettings.theme);

  return createChartStyles(
    { colors, colorsArray },
    {
      chart: {
        type: "bar",
        animations: {
          enabled: false,
        },
      },
      xaxis: {
        categories: categories.value,
        labels: {
          formatter: formatterX,
        },
      },
      yaxis: {
        labels: {
          formatter: formatterY,
        },
      },
      grid: {
        yaxis: {
          lines: {
            show: false,
          },
        },
        xaxis: {
          lines: {
            show: true,
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        followCursor: false,
        enabled: true,
        intersect: false,
        custom: (x: DataPoint<number>) => {
          const pool = categories.value[x.dataPointIndex];
          const delta = x.series[0][x.dataPointIndex];

          const data = [
            `<div><b>${pool}</b>:</div><div>${formatterX(delta)}</div>`,
          ];

          return data.join("");
        },
      },
    }
  );
});

const categories = computed((): string[] => data.value.map((x) => x.name));

const series = computed((): { data: number[] }[] => [
  { data: data.value.map((x) => x.liq_use) },
]);

// Hooks
onMounted(async () => {
  loading.value = true;

  data.value = await curveService
    .getLiquidityTop()
    .then((x) => x.liquidity_use.sort((a, b) => b.liq_use - a.liq_use));

  loading.value = false;
});

// Methods
const formatterX = (x: number): string => `${round(Math.abs(x), 2, "dollar")}`;

const formatterY = (x: string): string => x.toString().substring(0, 12);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.card-graph {
  ::v-deep(.card-body) {
    @media only screen and (max-width: 1280px) {
      height: 200px;
    }
  }
}
</style>
