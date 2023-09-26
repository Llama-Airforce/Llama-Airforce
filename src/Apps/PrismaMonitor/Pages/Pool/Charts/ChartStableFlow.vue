<template>
  <CardGraph
    class="chart"
    title="mkUSD deposits and withdrawals"
    :loading="loading"
    :options="options"
    :series="series"
  ></CardGraph>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from "vue";
import { CardGraph } from "@/Framework";
import { createChartStyles } from "@/Styles/ChartStyles";
import { getColors, getColorsArray } from "@/Styles/Themes/CM";
import { getHost } from "@/Services/Host";
import PrismaService, {
  type StableFlows
} from "@PM/Services/PrismaService";
import { useSettingsStore } from "@PM/Stores/SettingsStore";
import {round, unit} from "@/Util";

interface TooltipParams {
  series: number[][];
  dataPointIndex: number;
  w: { globals: { seriesNames: string[] } };
}

const prismaService = new PrismaService(getHost());
const storeSettings = useSettingsStore();

// Refs
const loading = ref(true);
const data = ref<StableFlows>({"deposits": [], "withdrawals": []});


// Hooks
onMounted(async (): Promise<void> => {
  loading.value = true;
  try {
    data.value = await prismaService
      .getStableFlow("ethereum", "1m");
  } catch (error) {
    console.error("An error occurred while loading data:", error);
  } finally {
    loading.value = false;
  }
});

// eslint-disable-next-line max-lines-per-function
const options = computed(() => {
  const colors = getColors(storeSettings.theme);
  const colorsArray = getColorsArray(storeSettings.theme);

  return createChartStyles(
    { colors, colorsArray },
    {
      chart: {
        type: "bar",
        stacked: "true",
        animations: {
          enabled: false,
        },
        toolbar: {
          show: false
        },
      },
      colors: [colors.green, colors.red],

      xaxis: {
        categories: categories.value,
        labels: {
          formatter: formatterX,
          rotate: -60,
        },
        tickPlacement: 'on',

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
        custom: ({ series, dataPointIndex, w }: TooltipParams) => {
          let total = 0;
          const data = series.map((managerSeries, index) => {
            const value = managerSeries[dataPointIndex];
            total += value;
            return `<div><b>${w.globals.seriesNames[index]}</b>: ${formatterY(value)}</div>`;
          });

          // Add total
          data.push(`<div><b>Total</b>: ${formatterY(total)}</div>`);

          return data.join("");
        },
      },
    }
  );
});

const categories = computed((): string[] => {
  if (data.value.deposits.length === 0) {
    return [];
  }

  return data.value.deposits.map((point) => {
    return new Date(point.timestamp * 1000).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "2-digit",
    });
  });
});


const series = computed((): { name: string, data: number[] }[] => [
  {
    name: "Deposits",
    data: Object.values(data.value.deposits)
      .map((x) => x.value),
  },
  {
    name: "Withdrawals",
    data: Object.values(data.value.withdrawals)
      .map((x) => x.value),
  },
]);


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
