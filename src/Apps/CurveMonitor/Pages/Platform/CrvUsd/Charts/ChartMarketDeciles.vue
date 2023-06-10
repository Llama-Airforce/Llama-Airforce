<template>
  <CardGraph
    class="chart"
    title="Debt Deciles"
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
import { type DataPoint, round, unit } from "@/Util";
import { getHost } from "@/Services/Host";
import CurveService, {
  type MarketDeciles,
  type MarketDecile,
} from "@CM/Pages/Platform/CrvUsd/Services/CurveService";
import { useCurveMonitorStore } from "@CM/Store";

const curveService = new CurveService(getHost());

// Props
interface Props {
  market: string;
}

const { market } = defineProps<Props>();

// Refs
const store = useCurveMonitorStore();

const loading = ref(true);
const data = ref<MarketDeciles>({});

// eslint-disable-next-line max-lines-per-function
const options = computed(() => {
  const colors = getColors(store.theme);
  const colorsArray = getColorsArray(store.theme);

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
      plotOptions: {
        bar: {
          columnWidth: "50%",
        },
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        followCursor: false,
        enabled: true,
        intersect: false,
        custom: (x: DataPoint<number>) => {
          const price = categories.value[x.dataPointIndex];
          const count = x.series[0][x.dataPointIndex];

          const data = [
            `<div><b>${price}</b>:</div><div>${formatterY(count)}</div>`,
          ];

          return data.join("");
        },
      },
    }
  );
});

const categories = computed((): string[] => Object.keys(data.value).reverse());

const series = computed((): { data: number[] }[] => [
  {
    data: Object.values(data.value)
      .map((x) => (x as MarketDecile).debt)
      .reverse(),
  },
]);

// Hooks
onMounted(async () => {
  loading.value = true;

  data.value = await curveService
    .getMarketUserDeciles(market)
    .then((x) => x.deciles);

  loading.value = false;
});

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
