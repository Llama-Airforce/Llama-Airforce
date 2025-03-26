<script setup lang="ts">
import createChartOptions, { createAreaSerie } from "@/Styles/ChartStylesLW";
import type { Snapshot } from "@HA/services/user/schema";

export type Serie = "interestAccrued" | "redemptionLost";
const serie = ref<Serie>("interestAccrued");

const { snapshots } = defineProps<{
  snapshots: Snapshot[];
}>();

// Chart
const theme = useTheme();
const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: [
    createAreaSerie({
      name: "interestAccrued" as const,
      color: computed(() => theme.value.colors.yellow),
      formatter: "volume",
    }),
    createAreaSerie({
      name: "redemptionLost" as const,
      color: computed(() => theme.value.colors.purple),
      formatter: "volume",
    }),
  ],
});

const hasData = computed(() => snapshots.length > 0);

// Calculate cumulative values for each metric
watchEffect(createSeries);
function createSeries() {
  if (
    !chart.value ||
    !series.interestAccrued ||
    !series.redemptionLost ||
    !hasData.value
  ) {
    return;
  }

  // Sort data by time
  const sortedData = [...snapshots].sort(
    (a, b) => a.time.getTime() - b.time.getTime()
  );

  // Calculate cumulative values
  let cumulativeInterest = 0;
  let cumulativeRedemption = 0;

  const interestSeries = sortedData.map((x) => {
    cumulativeInterest += x.interestAccrued;
    return {
      time: x.time.getUTCTimestamp(),
      value: cumulativeInterest,
    };
  });

  const redemptionSeries = sortedData.map((x) => {
    cumulativeRedemption += x.redemptionLost;
    return {
      time: x.time.getUTCTimestamp(),
      value: cumulativeRedemption,
    };
  });

  series.interestAccrued.setData(interestSeries);
  series.redemptionLost.setData(redemptionSeries);

  series.interestAccrued.applyOptions({
    visible: serie.value === "interestAccrued",
  });
  series.redemptionLost.applyOptions({
    visible: serie.value === "redemptionLost",
  });

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    ref="card"
    title="Cumulative Interest & Redemption"
  >
    <template #actions>
      <div
        v-if="hasData"
        style="display: flex"
      >
        <BtnChartLWExport
          filename="interest-redemption"
          :series
        />

        <BtnChartLWFullscreen
          :chart
          :target="card"
        />
      </div>
    </template>

    <template #actions-secondary>
      <div
        v-if="hasData"
        class="button-group"
      >
        <ButtonToggle
          :model-value="serie === 'interestAccrued'"
          @click="serie = 'interestAccrued'"
        >
          Interest Accrued
        </ButtonToggle>

        <ButtonToggle
          :model-value="serie === 'redemptionLost'"
          @click="serie = 'redemptionLost'"
        >
          Redemption Lost
        </ButtonToggle>
      </div>
    </template>

    <div
      v-if="hasData"
      ref="chartRef"
      class="chart"
    ></div>

    <NoData
      v-else
      message="No interest data available"
    />
  </Card>
</template>

<style scoped>
.chart {
  height: 100%;
  min-height: 250px;
}
</style>
