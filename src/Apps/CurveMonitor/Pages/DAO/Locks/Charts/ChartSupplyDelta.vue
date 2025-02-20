<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";
import { BtnChartLWExport, BtnChartLWFullscreen } from "@CM/components";
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

// Chart
const theme = useTheme();

const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: {
    type: "Histogram",
    name: "deltas" as const,
    options: computed<HistogramSeriesPartialOptions>(() => ({
      priceFormat: {
        type: "custom",
        formatter: (x: number) => `${round(x, 0, "dollar")}${unit(x)}`,
        minMove: 0.01,
      },
      color: theme.value.colors.blue,
      lastValueVisible: false,
      priceLineVisible: false,
    })),
  },
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.deltas) {
    return;
  }

  const { colors } = theme.value;

  const newDeltasSerie = supply.value
    .map((x) => ({
      time: x.timestamp.getUTCTimestamp(),
      value: x.veCrvTotal,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .reduce<HistogramData[]>((acc, curr, index, array) => {
      if (index === 0) return acc;

      const value = curr.value - array[index - 1].value;
      const color = value < 0 ? colors.red : colors.green;

      acc.push({
        time: curr.time,
        value: Number(value) / 10 ** 18,
        color,
      });
      return acc;
    }, []);

  if (newDeltasSerie.length > 0) {
    series.deltas.setData(newDeltasSerie);
    chart.value.timeScale().fitContent();
  }
}
</script>

<template>
  <Card
    ref="card"
    title="veCRV Change"
    :loading
  >
    <template #actions>
      <div style="display: flex">
        <BtnChartLWExport
          filename="distributions_delta"
          :series
        />

        <BtnChartLWFullscreen
          :chart
          :target="card"
        />
      </div>
    </template>

    <template #actions-secondary>
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
    </template>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>
