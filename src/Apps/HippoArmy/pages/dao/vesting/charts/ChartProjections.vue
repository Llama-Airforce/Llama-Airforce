<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";
import {
  useRedemptionsProjection,
  useAirdropsTeamProjection,
  useAirdropsVictimsProjection,
} from "@HA/queries/vesting";

const chain = { chain: "ethereum" };
const { data: redemptionsProjection } = useRedemptionsProjection(chain);
const { data: airdropsTeamProjection } = useAirdropsTeamProjection(chain);
const { data: airdropsVictimsProjection } = useAirdropsVictimsProjection(chain);

const theme = useTheme();

const { items, toggles, disabled } = useLegend(() => [
  {
    id: "victimsAirdrops",
    label: "Victims Airdrops",
    color: theme.value.colorsArray[2],
    togglable: true,
  },
  {
    id: "teamAirdrops",
    label: "Team Airdrops",
    color: theme.value.colorsArray[1],
    togglable: true,
  },
  {
    id: "redemptions",
    label: "Redemptions",
    color: theme.value.colorsArray[0],
    togglable: true,
  },
]);

const combinedData = computed(() => {
  if (
    !redemptionsProjection.value ||
    !airdropsTeamProjection.value ||
    !airdropsVictimsProjection.value
  ) {
    return [];
  }

  // Collect all unique timestamps
  const allTimestamps = new Set<number>();

  for (const item of redemptionsProjection.value.projection) {
    allTimestamps.add(item.timestamp.getTime());
  }

  for (const item of airdropsTeamProjection.value.projection) {
    allTimestamps.add(item.timestamp.getTime());
  }

  for (const item of airdropsVictimsProjection.value.projection) {
    allTimestamps.add(item.timestamp.getTime());
  }

  const sortedTimestamps = Array.from(allTimestamps).sort();

  /*
   * Find the last value for each series to maintain it as a straight line
   * Get all victim airdrop data points and find the last one
   */
  const victimsData = airdropsVictimsProjection.value.projection
    .map((item) => ({ time: item.timestamp.getTime(), value: item.value }))
    .sort((a, b) => a.time - b.time);

  const teamData = airdropsTeamProjection.value.projection
    .map((item) => ({ time: item.timestamp.getTime(), value: item.value }))
    .sort((a, b) => a.time - b.time);

  // Keep track of the last values
  let lastVictimsValue =
    victimsData.length > 0 ? victimsData[victimsData.length - 1].value : 0;
  let lastTeamValue =
    teamData.length > 0 ? teamData[teamData.length - 1].value : 0;

  // Create data for stacked area chart
  return sortedTimestamps.map((timestamp) => {
    const date = new Date(timestamp);

    // Find matching items for each projection or use last value
    const redemption =
      redemptionsProjection.value.projection.find(
        (item) => item.timestamp.getTime() === timestamp
      )?.value || 0;

    // For team airdrops, find actual value or use last known value
    const teamAirdropPoint = airdropsTeamProjection.value.projection.find(
      (item) => item.timestamp.getTime() === timestamp
    );

    // If a data point exists, update the last value
    if (teamAirdropPoint) {
      lastTeamValue = teamAirdropPoint.value;
    }

    // For victims airdrops, find actual value or use last known value
    const victimsAirdropPoint = airdropsVictimsProjection.value.projection.find(
      (item) => item.timestamp.getTime() === timestamp
    );

    // If a data point exists, update the last value
    if (victimsAirdropPoint) {
      lastVictimsValue = victimsAirdropPoint.value;
    }

    return {
      time: date.getUTCTimestamp(),
      values: [
        toggles.victimsAirdrops.value ? lastVictimsValue : 0,
        toggles.teamAirdrops.value ? lastTeamValue : 0,
        toggles.redemptions.value ? redemption : 0,
      ],
    };
  });
});

const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: {
    type: "StackedArea",
    name: "stacked" as const,
    options: computed<StackedAreaSeriesPartialOptions>(() => ({
      priceFormat: {
        type: "custom",
        formatter: (y: number) => `${round(y, 0, "dollar")}${unit(y)}`,
      },
      // Use color array based on legend items
      colors: [
        {
          line: theme.value.colorsArray[2],
          area: `${theme.value.colorsArray[2]}33`,
        }, // victims
        {
          line: theme.value.colorsArray[1],
          area: `${theme.value.colorsArray[1]}33`,
        }, // team
        {
          line: theme.value.colorsArray[0],
          area: `${theme.value.colorsArray[0]}33`,
        }, // redemptions
      ],
      lineWidth: 2,
      lastValueVisible: false,
      priceLineVisible: false,
    })),
  },
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.stacked) {
    return;
  }

  const stackedData = combinedData.value;

  if (stackedData.length > 0) {
    series.stacked.setData(stackedData);
  }

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    ref="card"
    title="Vesting Projections"
    class="stack-actions"
  >
    <template #actions>
      <div style="display: flex">
        <BtnChartLWFullscreen
          :chart
          :target="card"
        />
      </div>
    </template>

    <template #actions-secondary>
      <div class="actions-secondary">
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
