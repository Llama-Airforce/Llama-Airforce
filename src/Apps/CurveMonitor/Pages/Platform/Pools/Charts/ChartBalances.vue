<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";
import { BtnChartLWExport, BtnChartLWFullscreen } from "@CM/Components/";

type Balance = {
  timestamp: number;
  balance: number;
  tokenPrice: number;
};

type Balances = {
  symbol: string;
  balances: Balance[];
}[];

const { balances } = defineProps<{
  balances: Balances;
}>();

const theme = useTheme();

// Legend
const { items, toggles, disabled } = useLegend(() =>
  balances.map(({ symbol }, i) => ({
    id: symbol,
    label: symbol,
    color: theme.value.colorsArray[i],
    togglable: true,
  }))
);

// Chart
const card = useTemplateRef("card");

const STORAGE_DOLLARS = "chart_pool_balances_dollars";
const dollars = useStorage<boolean>(
  STORAGE_DOLLARS,
  false
);

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: balances.map(({ symbol }, i) => ({
    type: "Line",
    name: symbol,
    options: computed<LineSeriesPartialOptions>(() => ({
      priceFormat: {
        type: "custom",
        formatter: (y: number) =>
          `${round(y, 1, "dollar")}${unit(y, "dollar")}`,
      },
      lineWidth: 2,
      lineType: LineType.WithSteps,
      color: theme.value.colorsArray[i],
      lastValueVisible: false,
      priceLineVisible: false,
    })),
  })),
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || Object.values(series).length < 0) {
    return;
  }

  for (const { symbol, balances: bs } of balances.values()) {
    // Don't render disabled symbols. But keep the serie so colors don't get mixed up.
    if (!toggles[symbol].value) {
      series[symbol]?.setData([]);
      continue;
    }

    const toDollars = dollars.value;

    const newSerie = bs
      .map((x) => ({
        time: x.timestamp as UTCTimestamp,
        value: toDollars ? x.balance * x.tokenPrice : x.balance,
      }))
      .uniqWith((x, y) => x.time === y.time)
      .orderBy((c) => c.time, "asc");

    if (newSerie.length > 0) {
      series[symbol]?.setData(newSerie);
    }
  }

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    ref="card"
    class="stack-actions"
    title="Balances"
  >
    <template #actions>
      <div style="display: flex">
        <ButtonToggle
          :model-value="dollars"
          @click="dollars = !dollars"
        >
          <i class="fas fa-dollar-sign"></i>
        </ButtonToggle>

        <BtnChartLWExport
          filename="balances"
          :series
        ></BtnChartLWExport>

        <BtnChartLWFullscreen
          :chart
          :target="card"
        />
      </div>
    </template>

    <template #actions-secondary>
      <Legend
        :items
        :disabled
        @toggle="toggles[$event].value = !toggles[$event].value"
      ></Legend>
    </template>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>
