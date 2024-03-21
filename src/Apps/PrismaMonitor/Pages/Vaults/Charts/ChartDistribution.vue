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
import { createChartStyles } from "@/Styles/ChartStyles";
import { getColors, getColorsArray } from "@/Styles/Themes/PM";
import { useSettingsStore } from "@PM/Stores";
import { type DecimalLabelledSeries } from "@PM/Services";

// Props
interface Props {
  data: DecimalLabelledSeries[];
}

const { data = [] } = defineProps<Props>();

// Refs
const storeSettings = useSettingsStore();

const options = computed((): unknown => {
  const colors = getColors(storeSettings.theme, storeSettings.flavor);
  const colorsArray = getColorsArray(storeSettings.theme, storeSettings.flavor);

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
          show: false,
        },
      },
      xaxis: {
        categories: categories.value,
        labels: {
          rotate: -45,
        },
        tickPlacement: "on",
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

const series = computed((): { name: string; data: number[] }[] => [
  {
    name: "# of troves",
    data: Object.values(data).map((x) => x.value),
  },
]);

const categories = computed(() => data.map((x) => x.label));
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.graph {
  ::v-deep(.card-body) {
    @media only screen and (max-width: 1280px) {
      height: 300px;
    }

    .apexcharts-tooltip {
      grid-template-rows: auto auto;
    }
  }
}
</style>
