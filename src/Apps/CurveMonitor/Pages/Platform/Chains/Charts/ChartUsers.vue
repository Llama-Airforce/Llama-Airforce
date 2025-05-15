<script setup lang="ts">
import createChartOptions, { createAreaSerie } from "@/Styles/ChartStylesLW";

type Users = {
  timestamp: number;
  count: number;
};

const { users } = defineProps<{
  users: Users[];
}>();

// Chart
const theme = useTheme();
const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: createAreaSerie({
    name: "users" as const,
    color: computed(() => theme.value.colors.blue),
    formatter: (x: number) => `${round(x, 0, "dollar")}${unit(x)}`,
    minMove: 0.01,
  }),
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.users) {
    return;
  }

  series.users.setData(
    users
      .map((c) => ({
        time: c.timestamp as UTCTimestamp,
        value: c.count,
      }))
      .uniqWith((x, y) => x.time === y.time)
      .orderBy((c) => c.time, "asc")
  );

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    ref="card"
    title="Users"
  >
    <template #actions>
      <div style="display: flex">
        <BtnChartLWExport
          filename="users"
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
