<script setup lang="ts">
import createChartOptions, { createAreaSerie } from "@/Styles/ChartStylesLW";
import { useQueryUserLocks } from "@CM/queries/dao";

export type Type = "locks" | "total";
const type = ref<Type>("locks");

const { user } = defineProps<{ user: string | undefined }>();

const { isFetching: loading, data } = useQueryUserLocks(toRef(() => user));

// Chart
const theme = useTheme();

const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: [
    {
      type: HistogramSeries,
      name: "locks" as const,
      options: computed<HistogramSeriesPartialOptions>(() => ({
        color: theme.value.colors.yellow,
        lastValueVisible: false,
        priceFormat: {
          type: "volume",
        },
        priceLineVisible: false,
      })),
    },
    createAreaSerie({
      name: "total" as const,
      color: computed(() => theme.value.colors.blue),
      formatter: "volume",
    }),
  ],
});

const hasData = computed(() => data.value.length > 0);

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.locks || !series.total) {
    return;
  }

  const newLocksSeries = data.value
    .map((x) => ({
      time: x.timestamp.getUTCTimestamp(),
      value: Number(x.amount) / 10 ** 18,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  const newTotalSeries = data.value
    .map((x) => ({
      time: x.timestamp.getUTCTimestamp(),
      value: Number(x.lockedBalance) / 10 ** 18,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  series.locks.setData(newLocksSeries);
  series.total.setData(newTotalSeries);

  series.locks.applyOptions({ visible: type.value === "locks" });
  series.total.applyOptions({ visible: type.value === "total" });

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    ref="card"
    title="Locks over time"
    :loading
  >
    <template #actions>
      <div
        v-if="hasData"
        style="display: flex"
      >
        <BtnChartLWExport
          filename="loans"
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
          :model-value="type === 'locks'"
          @click="type = 'locks'"
        >
          Locks
        </ButtonToggle>

        <ButtonToggle
          :model-value="type === 'total'"
          @click="type = 'total'"
        >
          Total
        </ButtonToggle>
      </div>
    </template>

    <div
      v-if="hasData"
      ref="chartRef"
      class="chart"
    ></div>

    <NoData
      v-else-if="!loading"
      :message="`User ${addressShort(user)} has no veCRV locks`"
    />
  </Card>
</template>
