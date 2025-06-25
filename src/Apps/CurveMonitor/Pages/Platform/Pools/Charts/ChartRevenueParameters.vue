<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";
import { useQuerySnapshots, useQueryVolume } from "@CM/queries/pools";
import type { Chain } from "@curvefi/prices-api";
import type { Pool } from "@curvefi/prices-api/pools";

const { pool, chain } = defineProps<{
  pool: Pool | undefined;
  chain: Chain | undefined;
}>();

const poolAddr = computed(() => pool?.address);

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

const { isFetching: loadingVolume, data: volume } = useQueryVolume(
  toRef(() => chain),
  poolAddr,
  days
);

const { isFetching: loadingSnapshots, data: snapshots } = useQuerySnapshots(
  toRef(() => chain),
  poolAddr,
  days
);

const loading = computed(() => loadingSnapshots.value || loadingVolume.value);

const parameters = computed(() =>
  [...snapshots.value, ...volume.value]
    .groupBy((item) => item.timestamp.getTime())
    .entries()
    .filter(([, items]) => items.length === 2)
    .map(([, items]) => {
      const timestamp = items[0].timestamp;
      const snapshot = items.find((item) => "a" in item);
      const offpegFeeMultiplier = snapshot?.offpegFeeMultiplier ?? 0;
      const a = snapshot?.a ?? 0;
      const fee = snapshot?.fee ?? 0;
      const revenue = items.find((item) => "volume" in item)?.fees ?? 0;

      return {
        timestamp,
        revenue,
        a,
        fee,
        offpegFeeMultiplier,
      };
    })
);

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
        visible:
          toggles.a.value ||
          toggles.fee.value ||
          toggles.offpegFeeMultiplier.value,
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
        priceFormat: {
          type: "custom",
          formatter: (x: number) => `${Math.round(x)}`,
          minMove: 1,
        },
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
    parameters.value
      .map((x) => ({
        time: x.timestamp.getUTCTimestamp(),
        value: x.revenue,
      }))
      .uniqWith((x, y) => x.time === y.time)
      .orderBy((x) => x.time, "asc")
  );

  series.a.setData(
    parameters.value
      .map((x) => ({
        time: x.timestamp.getUTCTimestamp(),
        value: x.a,
      }))
      .uniqWith((x, y) => x.time === y.time)
      .orderBy((x) => x.time, "asc")
  );

  series.fee.setData(
    parameters.value
      .map((x) => ({
        time: x.timestamp.getUTCTimestamp(),
        value: x.fee / 1e8,
      }))
      .uniqWith((x, y) => x.time === y.time)
      .orderBy((x) => x.time, "asc")
  );

  series.offpegFeeMultiplier.setData(
    parameters.value
      .map((x) => ({
        time: x.timestamp.getUTCTimestamp(),
        value: x.offpegFeeMultiplier / 1e10,
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
    :loading
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
