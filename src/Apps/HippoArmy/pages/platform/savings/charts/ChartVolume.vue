<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";
import { useVolumeHistory } from "@HA/queries/savings";

const { isFetching: loading, data } = useVolumeHistory(
  toRef(() => ({ chain: "ethereum" }))
);

const theme = useTheme();
const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: [
    {
      type: HistogramSeries,
      name: "deposits" as const,
      options: computed<HistogramSeriesPartialOptions>(() => ({
        priceFormat: {
          type: "custom",
          formatter: (y: number) => `$${round(y, 1, "dollar")}${unit(y)}`,
        },
        color: theme.value.colors.green,
        lastValueVisible: false,
        priceLineVisible: false,
      })),
    },
    {
      type: HistogramSeries,
      name: "withdrawals" as const,
      options: computed<HistogramSeriesPartialOptions>(() => ({
        priceFormat: {
          type: "custom",
          formatter: (y: number) => `$${round(y, 1, "dollar")}${unit(y)}`,
        },
        color: theme.value.colors.red,
        lastValueVisible: false,
        priceLineVisible: false,
      })),
    },
  ],
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.deposits || !series.withdrawals) return;

  const rows = data.value ?? [];
  const deposits = rows
    .map((r) => ({ time: r.timestamp.getUTCTimestamp(), value: r.depositUsd }))
    .filter((x) => x.value > 0)
    .orderBy((x) => x.time, "asc");
  const withdrawals = rows
    .map((r) => ({
      time: r.timestamp.getUTCTimestamp(),
      value: -r.withdrawUsd,
    }))
    .filter((x) => x.value < 0)
    .orderBy((x) => x.time, "asc");

  series.deposits.setData(deposits);
  series.withdrawals.setData(withdrawals);

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    ref="card"
    title="Volume"
    :loading
  >
    <template #actions>
      <div style="display: flex">
        <BtnChartLWExport
          filename="volume"
          :series
        />
        <BtnChartLWFullscreen
          :chart
          :target="card"
        />
      </div>
    </template>
    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>
