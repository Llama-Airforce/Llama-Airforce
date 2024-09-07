<script setup lang="ts">
import { useSettingsStore } from "@CM/Stores";
import { BtnChartLWExport, BtnChartLWFullscreen } from "@CM/Components/";
import { useQuerySnapshots } from "@CM/Services/LlamaLend/Queries";
import { type Chain } from "@CM/Models";
import createChartOptions from "@CM/Util/ChartStyles";
import { type Market } from "@CM/Services/LlamaLend";

const { market, chain } = defineProps<{
  market: Market | undefined;
  chain: Chain | undefined;
}>();

// Data
const { isFetching: loading, data: snapshots } = useQuerySnapshots(
  toRef(() => market),
  toRef(() => chain)
);

// Chart
const { theme } = storeToRefs(useSettingsStore());

const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: {
    type: "Histogram",
    name: "loans" as const,
    options: computed<HistogramSeriesPartialOptions>(() => ({
      color: theme.value.colors.yellow,
      lastValueVisible: false,
      priceFormat: {
        type: "volume",
      },
      priceLineVisible: false,
    })),
  },
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.loans) {
    return;
  }

  const newLoansSeries = snapshots.value
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.numLoans,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newLoansSeries.length > 0) {
    series.loans.setData(newLoansSeries);

    const from = newLoansSeries[0].time;
    const to = newLoansSeries[newLoansSeries.length - 1].time;

    chart.value.timeScale().setVisibleRange({ from, to });
  }
}
</script>

<template>
  <Card
    ref="card"
    title="Loans"
    :loading
  >
    <template #actions>
      <div style="display: flex">
        <BtnChartLWExport
          filename="loans"
          :series
        ></BtnChartLWExport>

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
