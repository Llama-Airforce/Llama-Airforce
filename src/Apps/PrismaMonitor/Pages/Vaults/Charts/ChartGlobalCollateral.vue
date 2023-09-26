<template>
  <CardGraph
    class="chart"
    title="Collateral value"
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
  type HistoricalTroveManagerData
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
const data = ref<HistoricalTroveManagerData[]>([]);


// Hooks
onMounted(async (): Promise<void> => {
  loading.value = true;
  try {
    data.value = await prismaService
      .getHistoricalCollateralOverview("ethereum", "6m")
      .then((x) => x.managers);
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
        type: "area",
        stacked: "true",
        animations: {
          enabled: false,
        },
        toolbar: {
          show: false
        },
      },
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

      stroke: {
        curve: 'smooth'
      },
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 0.6,
          opacityTo: 0.8,
        }
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
      },
    }
  );
});

const categories = computed((): string[] => {
  if (data.value.length === 0 || data.value[0].data.length === 0) {
    return [];
  }

  return data.value[0].data.map((point) => {
    return new Date(point.timestamp * 1000).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "2-digit",
    });
  });
});

const series = computed(() => {
  if (data.value.length === 0) {
    return [];
  }

  return data.value.map((managerData) => {
    return {
      name: managerData.manager,
      data: managerData.data.map((point) => point.value),
    };
  });
});


// Methods
const formatterX = (x: string): string => x;
const formatterY = (y: number): string =>
  `$${round(y, 1, "dollar")}${unit(y, "dollar")}`;

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