<template>
  <CardGraph
    class="graph"
    title="Distribution of current user deposits"
    :loading="loading"
    :series="series"
    :options="options"
  >
  </CardGraph>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import { CardGraph } from "@/Framework";
import { createChartStyles } from "@/Styles/ChartStyles";
import { getColors, getColorsArray } from "@/Styles/Themes/CM";
import { useSettingsStore } from "@PM/Stores/SettingsStore";
import PrismaService, {type DecimalLabelledSeries} from "@PM/Services/PrismaService";
import {getHost} from "@/Services/Host";

const prismaService = new PrismaService(getHost());
const storeSettings = useSettingsStore();


// Refs
const loading = ref(true);
const data = ref<DecimalLabelledSeries[]>([]);


// Hooks
onMounted(async (): Promise<void> => {
  loading.value = true;
  try {
    data.value = await prismaService
      .getStableDistribution("ethereum").then((x) => x.distribution);
  } catch (error) {
    console.error("An error occurred while loading data:", error);
  } finally {
    loading.value = false;
  }
});

const options = computed((): unknown => {
  const colors = getColors(storeSettings.theme);
  const colorsArray = getColorsArray(storeSettings.theme);

  return createChartStyles(
    { colors, colorsArray },
    {
      chart: {
        id: "distribution",
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
          rotate: -45,
        },
        tickPlacement: 'on',
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
    }
  );
});


const series = computed((): { name: string, data: number[] }[] => [
  {
    name: "# of positions",
    data: Object.values(data.value)
      .map((x) => x.value),
  },
]);


const categories = computed(() =>
  data.value.map((x) => x.label)
);

</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.graph {

  height: 100%;

  ::v-deep(.card-body) {
    .apexcharts-tooltip {
      grid-template-rows: auto auto;
    }
  }
}
</style>
