<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";
import { useQuerySupply } from "@CM/queries/dao";

export type Period = "1m" | "3m" | "6m" | "1y";
const period = ref<Period>("1m");
const days = computed(() => {
  switch (period.value) {
    case "1m":
      return 30;
    case "3m":
      return 90;
    case "6m":
      return 180;
    case "1y":
      return 365;
    default:
      return 30;
  }
});

const { isFetching: loading, data: supply } = useQuerySupply(days);

// Legend
const theme = useTheme();

const { items, toggles, disabled } = useLegend(() => {
  const { blue, yellow, purple } = theme.value.colors;

  return [
    { id: "crv", label: "CRV", color: blue, togglable: true },
    { id: "circ", label: "Circulating", color: yellow, togglable: true },
    { id: "vecrv", label: "veCRV", color: purple, togglable: true },
  ];
});

// We only start with veCRV enabled to not skew the vertical scales.
toggles.circ.value = false;
toggles.crv.value = false;

// Chart
const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: [
    {
      type: LineSeries,
      name: "crv" as const,
      options: computed<LineSeriesPartialOptions>(() => ({
        priceFormat: {
          type: "custom",
          formatter: (x: number) => `${round(x, 2, "dollar")}${unit(x)}`,
          minMove: 0.01,
        },
        lineWidth: 2,
        color: theme.value.colors.blue,
        lastValueVisible: false,
        priceLineVisible: false,
      })),
    },
    {
      type: LineSeries,
      name: "circ" as const,
      options: computed<LineSeriesPartialOptions>(() => ({
        priceFormat: {
          type: "custom",
          formatter: (x: number) => `${round(x, 2, "dollar")}${unit(x)}`,
          minMove: 0.01,
        },
        lineWidth: 2,
        color: theme.value.colors.yellow,
        lastValueVisible: false,
        priceLineVisible: false,
      })),
    },
    {
      type: LineSeries,
      name: "vecrv" as const,
      options: computed<LineSeriesPartialOptions>(() => ({
        priceFormat: {
          type: "custom",
          formatter: (x: number) => `${round(x, 2, "dollar")}${unit(x)}`,
          minMove: 0.01,
        },
        lineWidth: 2,
        color: theme.value.colors.purple,
        lastValueVisible: false,
        priceLineVisible: false,
      })),
    },
  ],
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.crv || !series.circ || !series.vecrv) {
    return;
  }

  series.crv.setData(
    supply.value
      .map((x) => ({
        time: x.timestamp.getUTCTimestamp(),
        value: Number(x.crvSupply) / 10 ** 18,
      }))
      .uniqWith((x, y) => x.time === y.time)
      .orderBy((x) => x.time, "asc")
  );

  series.circ.setData(
    supply.value
      .map((x) => ({
        time: x.timestamp.getUTCTimestamp(),
        value: Number(x.circulatingSupply) / 10 ** 18,
      }))
      .uniqWith((x, y) => x.time === y.time)
      .orderBy((x) => x.time, "asc")
  );

  series.vecrv.setData(
    supply.value
      .map((x) => ({
        time: x.timestamp.getUTCTimestamp(),
        value: Number(x.veCrvTotal) / 10 ** 18,
      }))
      .uniqWith((x, y) => x.time === y.time)
      .orderBy((x) => x.time, "asc")
  );

  series.crv.applyOptions({ visible: toggles.crv.value });
  series.circ.applyOptions({ visible: toggles.circ.value });
  series.vecrv.applyOptions({ visible: toggles.vecrv.value });

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    ref="card"
    title="Token Supply"
    class="stack-actions"
    :loading
  >
    <template #actions>
      <div style="display: flex">
        <BtnChartLWExport
          filename="token_supply"
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

        <Legend
          :items
          :disabled
          @toggle="toggles[$event].value = !toggles[$event].value"
        />
      </div>
    </template>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<style scoped>
.actions-secondary {
  display: flex;
  gap: 2rem;
  justify-content: space-between;
}
</style>
