<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";

type Balance = {
  timestamp: Date;
  balance: number;
  tokenPrice: number;
};

type Balances = {
  symbol: string;
  balances: Balance[];
}[];

const {
  balances,
  title,
  showDollars = true,
} = defineProps<{
  balances: Balances;
  title?: string;
  showDollars?: boolean;
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

const STORAGE_TYPE = "chart_pool_balances_type";
const types = ["unstacked", "stacked", "100%"] as const;
type Types = (typeof types)[number];
type SelectType = { id: Types; label: string };
const typeOptions: SelectType[] = [
  { id: "unstacked", label: "Unstacked" },
  { id: "stacked", label: "Stacked" },
  { id: "100%", label: "Stacked (100%)" },
] as const;
const type = useStorage<Types>(STORAGE_TYPE, types[0]);

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: [
    ...balances.map(({ symbol }, i) => ({
      type: LineSeries,
      name: symbol,
      options: computed<LineSeriesPartialOptions>(() => ({
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

// Custom rendered charts don't support custom priceFormat, so we gotta change it for the chart itself.
watchEffect(() => {
  if (!chart.value) {
    return;
  }

  chart.value.applyOptions({
    localization: {
      priceFormatter:
        type.value === "100%"
          ? (y: number) => `${round(y, 0, "percentage")}%`
          : (y: number) => `${round(y, 1, "dollar")}${unit(y)}`,
    },
  });
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

  if (type.value === "unstacked") {
    createSeriesUnstacked();
  } else {
    createSeriesStacked(type.value === "100%");
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

    const toDollars = showDollars && dollars.value;

    const newSerie = bs
      .map((x) => ({
        time: x.timestamp.getUTCTimestamp(),
        value: toDollars ? x.balance * x.tokenPrice : x.balance,
      }))
      .uniqWith((x, y) => x.time === y.time)
      .orderBy((c) => c.time, "asc");

    if (newSerie.length > 0) {
      series[symbol]?.setData(newSerie);
    }
  }
}

function createSeriesStacked(normalize: boolean) {
  if (!series.stacked) {
    return;
  }

  const toDollars = showDollars && dollars.value;

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
    .groupBy((x) => x.timestamp.getTime())
    .entries()
    // One stacked datapoint is basically all points at a certain time.
    .map(([time, values]) => {
      const total = normalize
        ? values.reduce((sum, v) => sum + v.balance, 0)
        : 1;

      const calculatedValues = values.map((x) =>
        normalize ? (x.balance / total) * 100 : x.balance
      );

      return {
        time: (Number(time) / 1000) as UTCTimestamp,
        values: calculatedValues,
      };
    })
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
    :title="title ?? 'Balances'"
  >
    <template #actions>
      <div style="display: flex">
        <Select
          :options="typeOptions"
          :selected="typeOptions.find((x) => x.id === type) ?? typeOptions[0]"
          @select="type = $event.id"
        >
          <template #option="{ option }">
            {{ option.label }}
          </template>
        </Select>

        <Tooltip v-if="showDollars">
          <template #trigger>
            <ButtonToggle
              style="margin-right: 1rem"
              :model-value="dollars"
              @click="dollars = !dollars"
            >
              $
            </ButtonToggle>
          </template>

          Show token balances in USD.
        </Tooltip>

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
      />
    </template>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<style scoped>
.select {
  z-index: 2;
  width: 10rem;
  margin-right: 1rem;
}

.chart {
  /*
    Needed to make sure the select component doesn't get its
    mouse events hijacked by the chart, even when it's rendered below
  */
  position: relative;
  z-index: 1;
}
</style>
