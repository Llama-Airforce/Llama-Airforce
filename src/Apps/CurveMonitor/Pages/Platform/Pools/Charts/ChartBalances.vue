<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";
import { BtnChartLWFullscreen } from "@CM/Components/";

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
const dollars = useStorage<boolean>(STORAGE_DOLLARS, false);

const stacked = ref(false);

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: [
    ...balances.map(({ symbol }, i) => ({
      type: "Line" as const,
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
    {
      type: "StackedArea",
      name: "stacked" as const,
      options: computed<StackedAreaSeriesPartialOptions>(() => ({
        priceFormat: {
          type: "custom",
          formatter: (y: number) =>
            `${round(y, 1, "dollar")}${unit(y, "dollar")}`,
        },
        // Color array is based directly on toggled legend items to maintain consistent colors
        colors: items.value
          .map((item, i) => ({ item, i }))
          .filter(({ item }) => !disabled.value.includes(item.id))
          .map(({ i }) => i)
          .map((i) => theme.value.colorsArray[i])
          .map((x) => ({ line: x, area: x + "15" })),
        lineWidth: 2,
        lastValueVisible: false,
        priceLineVisible: false,
      })),
    },
  ],
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || Object.values(series).length < 0) {
    return;
  }

  // Reset all series first
  for (const serie of Object.values(series)) {
    serie?.setData([]);
  }

  if (stacked.value) {
    createSeriesStacked();
  } else {
    createSeriesUnstacked();
  }

  chart.value.timeScale().fitContent();
}

function createSeriesUnstacked() {
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
}

function createSeriesStacked() {
  if (!series.stacked) {
    return;
  }

  const toDollars = dollars.value;

  const newSerie = [...balances.values()]
    // Don't render disabled symbols.
    .filter(
      ({ symbol, balances }) => toggles[symbol].value && balances.length > 0
    )
    // Collect all datapoints with calculated balance so they can be grouped by time.
    .flatMap(({ symbol, balances }) =>
      balances.map((x) => ({
        symbol,
        timestamp: x.timestamp,
        balance: toDollars ? x.balance * x.tokenPrice : x.balance,
      }))
    )
    .groupBy((x) => x.timestamp)
    .entries()
    // One stacked datapoint is basically all points at a certain time.
    .map(([time, values]) => ({
      time: Number(time) as UTCTimestamp,
      values: values.orderBy((x) => x.symbol).map((x) => x.balance),
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newSerie.length > 0) {
    series.stacked.setData(newSerie);
  }
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

        <ButtonToggle
          :model-value="stacked"
          @click="stacked = !stacked"
        >
          <i class="fas fa-layer-group"></i>
        </ButtonToggle>

        <!-- Temp disabled because no support for stacked areas
        <BtnChartLWExport
          filename="balances"
          :series
        ></BtnChartLWExport>
        -->

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
