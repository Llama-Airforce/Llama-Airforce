<template>
  <CardGraph
    class="chart"
    title="Debt per Collateral Ratio Deciles"
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
import { round, unit } from "@/Util";
import { getHost } from "@/Services/Host";
import PrismaService, {
  type CollateralRatioDecilesData
} from "@PM/Services/PrismaService";
import { useSettingsStore } from "@PM/Stores/SettingsStore";

const prismaService = new PrismaService(getHost());
const storeSettings = useSettingsStore();

// Refs
const loading = ref(true);
const data = ref<CollateralRatioDecilesData[]>([]);


// Hooks
onMounted(async (): Promise<void> => {
  loading.value = true;
  try {
    data.value = await prismaService
      .getRatioDistributionGrouped("ethereum")
      .then((x) => x.deciles);
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
      },
    }
  );
});

const categories = computed((): string[] => data.value.map((x) => x.label));

const series = computed((): { name: string, data: number[] }[] => [
  {
    name: "Debt",
    data: Object.values(data.value)
      .map((x) => x.data),
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
