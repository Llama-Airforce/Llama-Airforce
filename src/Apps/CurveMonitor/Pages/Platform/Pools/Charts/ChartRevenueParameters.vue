<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";

type Snapshot = {
  timestamp: Date;
  revenue: number;
  a: number;
  fee: number;
  offpegFeeMultiplier: number;
};

const { snapshots } = defineProps<{
  snapshots: Snapshot[];
}>();

// Legend
const theme = useTheme();

const { items, toggles, disabled } = useLegend(() => {
  const { blue, yellow, green, purple } = theme.value.colors;

  return [
    { id: "revenue", label: "Revenue", color: blue, togglable: true },
    { id: "a", label: "A", color: yellow, togglable: true },
    { id: "fee", label: "Fee (param)", color: green, togglable: true },
    {
      id: "offpegFeeMultiplier",
      label: "Offpeg Fee Multiplier",
      color: purple,
      togglable: true,
    },
  ];
});

toggles.fee.value = false;
toggles.offpegFeeMultiplier.value = false;

// Chart
const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(
    computed(() => ({
      leftPriceScale: {
        visible: toggles.a.value || toggles.offpegFeeMultiplier.value,
      },
    }))
  ),
  series: [
    {
      type: LineSeries,
      name: "revenue" as const,
      options: computed<LineSeriesPartialOptions>(() => ({
        priceFormat: {
          type: "custom",
          formatter: (x: number) => `$${round(x, 1, "dollar")}${unit(x)}`,
          minMove: 1,
        },
        lineWidth: 2,
        color: theme.value.colors.blue,
        lastValueVisible: false,
        priceLineVisible: false,
      })),
    },
    {
      type: LineSeries,
      name: "a" as const,
      options: computed<LineSeriesPartialOptions>(() => ({
        priceFormat: {
          type: "custom",
          formatter: (x: number) => `${Math.round(x)}`,
          minMove: 1,
        },
        priceScaleId: "left",
        lineWidth: 2,
        color: theme.value.colors.yellow,
        lastValueVisible: false,
        priceLineVisible: false,
      })),
    },
    {
      type: LineSeries,
      name: "fee" as const,
      options: computed<LineSeriesPartialOptions>(() => ({
        priceFormat: {
          type: "custom",
          formatter: (x: number) => `${Math.round(x)}`,
          minMove: 1,
        },
        priceScaleId: "left",
        lineWidth: 2,
        color: theme.value.colors.green,
        lastValueVisible: false,
        priceLineVisible: false,
      })),
    },
    {
      type: LineSeries,
      name: "offpegFeeMultiplier" as const,
      options: computed<LineSeriesPartialOptions>(() => ({
        priceScaleId: "left",
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
  if (
    !chart.value ||
    !series.revenue ||
    !series.fee ||
    !series.a ||
    !series.offpegFeeMultiplier
  ) {
    return;
  }

  series.revenue.setData(
    snapshots
      .map((x) => ({
        time: x.timestamp.getUTCTimestamp(),
        value: x.revenue,
      }))
      .uniqWith((x, y) => x.time === y.time)
      .orderBy((x) => x.time, "asc")
  );

  series.a.setData(
    snapshots
      .map((x) => ({
        time: x.timestamp.getUTCTimestamp(),
        value: x.a,
      }))
      .uniqWith((x, y) => x.time === y.time)
      .orderBy((x) => x.time, "asc")
  );

  series.fee.setData(
    snapshots
      .map((x) => ({
        time: x.timestamp.getUTCTimestamp(),
        value: x.fee,
      }))
      .uniqWith((x, y) => x.time === y.time)
      .orderBy((x) => x.time, "asc")
  );

  series.offpegFeeMultiplier.setData(
    snapshots
      .map((x) => ({
        time: x.timestamp.getUTCTimestamp(),
        value: x.offpegFeeMultiplier,
      }))
      .uniqWith((x, y) => x.time === y.time)
      .orderBy((x) => x.time, "asc")
  );

  series.revenue.applyOptions({ visible: toggles.revenue.value });
  series.a.applyOptions({ visible: toggles.a.value });
  series.fee.applyOptions({ visible: toggles.fee.value });
  series.offpegFeeMultiplier.applyOptions({
    visible: toggles.offpegFeeMultiplier.value,
  });

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    ref="card"
    title="Revenue & Parameters"
    class="stack-actions"
  >
    <template #actions>
      <div style="display: flex">
        <BtnChartLWExport
          filename="parameters_and_fees"
          :series
        />

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
