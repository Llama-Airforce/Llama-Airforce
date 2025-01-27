<script setup lang="ts">
import type { BaselineSeriesPartialOptions } from "lightweight-charts";
import createChartOptions from "@/Styles/ChartStylesLW";
import { BtnChartLWExport, BtnChartLWFullscreen } from "@CM/Components/";

type Equity = {
  timestamp: Date;
  equity: number;
};

const { equity } = defineProps<{
  equity: Equity[];
}>();

// Chart
const theme = useTheme();

const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: {
    type: "Baseline",
    name: "equity" as const,
    options: computed<BaselineSeriesPartialOptions>(() => {
      const { colors } = theme.value;

      return {
        priceFormat: {
          type: "custom",
          formatter: (x: number) => `$${round(x, 0, "dollar")}${unit(x)}`,
          minMove: 0.01,
        },
        lineWidth: 2,
        baseValue: { type: "price", price: 0 },
        topLineColor: colors.green,
        bottomLineColor: colors.red,
        lastValueVisible: false,
        priceLineVisible: false,
      };
    }),
  },
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.equity) {
    return;
  }

  const newEquitySerie = equity
    .map((x) => ({
      time: x.timestamp.getUTCTimestamp(),
      value: x.equity,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newEquitySerie.length > 0) {
    series.equity.setData(newEquitySerie);
  }

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    ref="card"
    title="Equity"
  >
    <template #actions>
      <div style="display: flex; align-items: center">
        <Tooltip style="margin-right: 1rem">
          <span>
            This chart shows the difference between the value of the collateral
            and the debt.<br /><br />
            Positive values indicate net equity (collateral exceeds debt),<br />
            while negative values indicate a deficit (debt exceeds collateral,
            also known as bad debt).
          </span>
        </Tooltip>

        <BtnChartLWExport
          filename="equity"
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
