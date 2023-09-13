<template>
  <CardGraph
    class="chart"
    title="Debt & Assets per Health Deciles"
    :loading="loading"
    :options="options"
    :series="series"
  ></CardGraph>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { CardGraph } from "@/Framework";
import { createChartStyles } from "@/Styles/ChartStyles";
import { getColors, getColorsArray } from "@/Styles/Themes/CM";
import { type DataPoint, round, unit } from "@/Util";
import { getHost } from "@/Services/Host";
import CurveService, {
  type HealthDecile,
} from "@CM/Pages/Platform/CrvUsd/Services/CurveService";
import { useSettingsStore } from "@CM/Stores/SettingsStore";
import type { Market } from "@CM/Pages/Platform/CrvUsd/Services/CurveService";

const curveService = new CurveService(getHost());

// Props
interface Props {
  market?: Market | null;
}

const { market = null } = defineProps<Props>();

// Refs
const storeSettings = useSettingsStore();

const loading = ref(true);
const data = ref<HealthDecile[]>([]);

// eslint-disable-next-line max-lines-per-function
const options = computed(() => {
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
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: categories.value,
        labels: {
          formatter: formatterX,
          rotate: -60,
        },
        tickPlacement: "on",
      },
      yaxis: {
        labels: {
          formatter: formatterY,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
        },
      },
      legend: {
        show: true,
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        followCursor: false,
        enabled: true,
        intersect: true,
        custom: (x: DataPoint<number>) => {
          const debt = x.series[0][x.dataPointIndex];
          const collateral = x.series[1][x.dataPointIndex];
          const stablecoin = x.series[2][x.dataPointIndex];
          const data = [
            `<div><b>Collat. (USD)</b>: ${formatterY(collateral)}</div>`,
            `<div><b>Debt</b>: ${formatterY(debt)}</div>`,
            `<div><b>Stablecoin</b>: ${formatterY(stablecoin)}</div>`,
          ];

          return data.join("");
        },
      },
    }
  );
});

const categories = computed((): string[] => data.value.map((x) => x.decile));

const series = computed((): { name: string; data: number[] }[] => [
  {
    name: "Debt",
    data: Object.values(data.value).map((x) => x.debt),
  },
  {
    name: "Collateral",
    data: Object.values(data.value).map((x) => x.collateralUsdValue),
  },
  {
    name: "Stablecoin",
    data: Object.values(data.value).map((x) => x.stablecoin),
  },
]);

// Watches
watch(
  () => market,
  async (newMarket) => {
    loading.value = true;

    if (!newMarket) {
      return;
    }

    data.value = await curveService
      .getHealthDeciles(newMarket.address)
      .then((x) => x.health);

    loading.value = false;
  },
  { immediate: true }
);

// Methods
const formatterX = (x: string): string => x;

const formatterY = (y: number): string =>
  `$${round(y, 0, "dollar")}${unit(y, "dollar")}`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.card-graph {
  ::v-deep(.card-body) {
    height: 300px;

    @media only screen and (max-width: 1280px) {
      height: 300px;
    }
  }
}
</style>
