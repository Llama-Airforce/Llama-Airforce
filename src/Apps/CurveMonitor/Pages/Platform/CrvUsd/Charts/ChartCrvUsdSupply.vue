<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";
import { BtnChartLWExport, BtnChartLWFullscreen } from "@CM/components";
import { useQueryCrvUsdSupply } from "@CM/queries/crvusd";

export type Period = "7d" | "1m" | "3m" | "6m" | "1y";
const period = ref<Period>("3m");
const days = computed(() => {
  switch (period.value) {
    case "7d":
      return 7;
    case "1m":
      return 30;
    case "3m":
      return 90;
    case "6m":
      return 180;
    case "1y":
      return 365;
    default:
      return 90;
  }
});

const theme = useTheme();

// Legend
const { items } = useLegend(() => [
  {
    id: "supply",
    label: "Supply",
    color: theme.value.colorsArray[0],
  },
  {
    id: "borrowed",
    label: "Borrowed",
    color: theme.value.colorsArray[1],
  },
]);

// Data
const { isFetching: loading, data } = useQueryCrvUsdSupply(days);

// Chart
const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: [
    {
      type: "Area",
      name: "supply" as const,
      options: computed<AreaSeriesPartialOptions>(() => ({
        priceFormat: {
          type: "custom",
          formatter,
        },
        lineWidth: 2,
        lineType: LineType.WithSteps,
        lineColor: theme.value.colors.blue,
        topColor: "rgb(32, 129, 240, 0.2)",
        bottomColor: "rgba(32, 129, 240, 0)",
        lastValueVisible: false,
        priceLineVisible: false,
      })),
    },
    {
      type: "Line",
      name: "debt" as const,
      options: computed<LineSeriesPartialOptions>(() => ({
        priceFormat: {
          type: "custom",
          formatter,
        },
        lineWidth: 2,
        lineType: LineType.WithSteps,
        color: theme.value.colors.yellow,
        lastValueVisible: false,
        priceLineVisible: false,
      })),
    },
  ],
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.debt || !series.supply) {
    return;
  }

  const newSupplySerie = data.value
    .groupBy((x) => x.timestamp.getTime())
    .entries()
    .map(([, x]) => ({
      time: x[0].timestamp.getUTCTimestamp(),
      value: x.reduce((acc, y) => acc + y.supply, 0),
      debt: x.find((y) => y.market === "Keepers debt")?.supply ?? 0,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  const newDebtSerie = newSupplySerie.map((x) => ({
    time: x.time,
    value: x.value - x.debt,
  }));

  if (newSupplySerie.length > 0) {
    series.supply.setData(newSupplySerie);
  }

  if (newDebtSerie.length > 0) {
    series.debt.setData(newDebtSerie);
  }

  chart.value.timeScale().fitContent();

  // Add marker for March 20, 2025
  const resupplyDate = new Date(Date.UTC(2025, 2, 20));
  series.supply.setMarkers([
    {
      time: resupplyDate.getUTCTimestamp(),
      position: "aboveBar",
      color: theme.value.colors.red,
      shape: "arrowDown",
      text: "Resupply Launch",
    },
  ]);
}

function formatter(y: number) {
  return `${round(y, 0, "dollar")}${unit(y)}`;
}
</script>

<template>
  <Card
    ref="card"
    title="crvUSD Supply"
    class="stack-actions"
    :loading
  >
    <template #actions>
      <div style="display: flex">
        <BtnChartLWExport
          filename="crvusd_supply"
          :series
        />

        <BtnChartLWFullscreen
          :chart
          :target="card"
        />
      </div>
    </template>

    <template #actions-secondary>
      <div class="actions-secondary">
        <div class="button-group">
          <ButtonToggle
            :model-value="period === '7d'"
            @click="period = '7d'"
          >
            7d
          </ButtonToggle>

          <ButtonToggle
            :model-value="period === '1m'"
            @click="period = '1m'"
          >
            1m
          </ButtonToggle>

          <ButtonToggle
            :model-value="period === '3m'"
            @click="period = '3m'"
          >
            3m
          </ButtonToggle>

          <ButtonToggle
            :model-value="period === '6m'"
            @click="period = '6m'"
          >
            6m
          </ButtonToggle>

          <ButtonToggle
            :model-value="period === '1y'"
            @click="period = '1y'"
          >
            1y
          </ButtonToggle>
        </div>

        <Legend :items />
      </div>
    </template>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<style scoped>
.chart-types {
  display: flex;
  font-size: 0.875rem;
}

.actions-secondary {
  display: flex;
  gap: 2rem;
  justify-content: space-between;
}
</style>
