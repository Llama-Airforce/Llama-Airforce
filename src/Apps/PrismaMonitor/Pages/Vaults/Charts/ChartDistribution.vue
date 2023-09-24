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
import { round, unit} from "@/Util";
import { createChartStyles } from "@/Styles/ChartStyles";
import { getColors, getColorsArray } from "@/Styles/Themes/CM";
import { useSettingsStore } from "@PM/Stores/SettingsStore";
import {type DecimalLabelledSeries} from "@PM/Services/PrismaService";


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
    name: "# of troves",
    data: Object.values(data)
      .map((x) => x.value),
  },
]);


const categories = computed(() =>
  data.map((x) => x.label)
);

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
