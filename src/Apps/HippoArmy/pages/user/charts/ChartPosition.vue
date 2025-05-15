<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";
import type { Snapshot } from "@HA/services/user/schema";

const { snapshots, user, loading } = defineProps<{
  snapshots: Snapshot[];
  user?: string;
  loading: boolean;
}>();

const hasData = computed(() => snapshots.length > 0);

// Legend
const theme = useTheme();

const { items, toggles, disabled } = useLegend(() => {
  const { green, red } = theme.value.colors;

  return [
    { id: "underlying", label: "Underlying", color: green, togglable: true },
    { id: "debt", label: "Debt", color: red, togglable: true },
  ];
});

// Chart
const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: [
    {
      type: LineSeries,
      name: "underlying" as const,
      options: computed<LineSeriesPartialOptions>(() => ({
        priceFormat: { type: "volume" },
        lineWidth: 2,
        color: theme.value.colors.green,
        lastValueVisible: false,
        priceLineVisible: false,
      })),
    },
    {
      type: LineSeries,
      name: "debt" as const,
      options: computed<LineSeriesPartialOptions>(() => ({
        priceFormat: { type: "volume" },
        lineWidth: 2,
        color: theme.value.colors.red,
        lastValueVisible: false,
        priceLineVisible: false,
      })),
    },
  ],
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.underlying || !series.debt) {
    return;
  }

  series.underlying.setData(
    snapshots
      .map((x) => ({
        time: x.time.getUTCTimestamp(),
        value: x.underlying,
      }))
      .uniqWith((x, y) => x.time === y.time)
      .orderBy((c) => c.time, "asc")
  );

  series.debt.setData(
    snapshots
      .map((x) => ({
        time: x.time.getUTCTimestamp(),
        value: x.debt,
      }))
      .uniqWith((x, y) => x.time === y.time)
      .orderBy((c) => c.time, "asc")
  );

  series.underlying.applyOptions({ visible: toggles.underlying.value });
  series.debt.applyOptions({ visible: toggles.debt.value });

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    ref="card"
    title="Position"
    :loading
  >
    <template #actions>
      <div
        v-if="hasData"
        style="display: flex"
      >
        <BtnChartLWExport
          filename="user-position"
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
        v-if="hasData"
        :items
        :disabled
        @toggle="toggles[$event].value = !toggles[$event].value"
      />
    </template>

    <div
      v-if="hasData"
      ref="chartRef"
      class="chart"
    ></div>

    <NoData
      v-else-if="!loading"
      :message="`User ${addressShort(user)} has no snapshots`"
    />
  </Card>
</template>

<style scoped>
.chart {
  height: 100%;
  min-height: 250px;
}
</style>
