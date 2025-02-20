<!-- eslint-disable indent -->
<script setup lang="ts">
import type { Address } from "@/types/address";
import createChartOptions from "@/Styles/ChartStylesLW";
import { BtnChartLWFullscreen } from "@CM/components";
import { useQueryPoolVolume } from "@CM/monitor/mev/queries";
import type { DurationType } from "@CM/monitor/socketMonitorCurve";
import SelectDuration from "../Components/SelectDuration.vue";

const { pool } = defineProps<{ pool: Address }>();

function darken(hex: string, amount: number): string {
  const rgb = hex
    .replace("#", "")
    .match(/.{2}/g)
    ?.map((x) => parseInt(x, 16));
  if (!rgb) return hex;

  const darker = rgb.map((c) => Math.max(0, Math.floor(c * (1 - amount))));
  return `#${darker.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

const theme = useTheme();
const colors = computed(() => ({
  volume: theme.value.colors.red,
  bars: [
    theme.value.colorsArray[1],
    darken(theme.value.colorsArray[1], 0.33),
    theme.value.colorsArray[0],
    darken(theme.value.colorsArray[0], 0.33),
  ],
}));

// Legend
const { items, toggles, disabled } = useLegend(() => [
  {
    id: "atomic",
    label: "Atomic",
    color: colors.value.bars[0],
    togglable: true,
  },
  {
    id: "cexdex",
    label: "Cexdex",
    color: colors.value.bars[1],
    togglable: true,
  },
  {
    id: "within",
    label: "Within",
    color: colors.value.bars[2],
    togglable: true,
  },
  {
    id: "outside",
    label: "Outside",
    color: colors.value.bars[3],
    togglable: true,
  },
  {
    id: "total",
    label: "Volume (Total)",
    color: colors.value.volume,
    togglable: true,
  },
]);

// Data
const timeDuration = ref<DurationType>({ value: 1, unit: "month" });
const timeInterval = ref<DurationType>({ value: 1, unit: "day" });

const { isFetching: loading, data } = useQueryPoolVolume(
  toRef(() => pool),
  timeDuration,
  timeInterval
);

// Chart
const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: [
    {
      type: "StackedBars",
      name: "data" as const,
      options: computed<StackedBarsSeriesPartialOptions>(() => ({
        priceFormat: {
          type: "custom",
          formatter: (y: number) => `$${round(y, 1, "dollar")}${unit(y)}`,
        },
        // Color array is based directly on toggled legend items to maintain consistent colors
        colors: items.value
          .map((item, i) => ({ item, i }))
          .filter(({ item }) => !disabled.value.includes(item.id))
          .map(({ i }) => i)
          .map((i) => colors.value.bars[i]),
        lastValueVisible: false,
        priceLineVisible: false,
      })),
    },
    {
      type: "Line" as const,
      name: "volume",
      options: computed<LineSeriesPartialOptions>(() => ({
        priceFormat: {
          type: "custom",
          formatter: (y: number) => `${round(y, 1, "dollar")}${unit(y)}`,
        },
        lineWidth: 2,
        lineType: LineType.Curved,
        color: colors.value.volume,
        lastValueVisible: false,
        priceLineVisible: false,
      })),
    },
  ],
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.volume || !series.data) {
    return;
  }

  const newVolumeSerie = disabled.value.includes("total")
    ? []
    : data.value
        .map((x) => ({
          time: x.interval_start_unixtime as UTCTimestamp,
          value: x.full_volume,
        }))
        .uniqWith((x, y) => x.time === y.time)
        .orderBy((c) => c.time, "asc");

  if (newVolumeSerie.length > 1) {
    series.volume.setData(newVolumeSerie);
    series.volume.applyOptions({ visible: true });
  } else {
    series.volume.applyOptions({ visible: false });
  }

  const newDataSerie = data.value
    .map((x) => ({
      time: x.interval_start_unixtime as UTCTimestamp,
      values: [
        ...(!disabled.value.includes("atomic") ? [x.atomicArbVolume] : []),
        ...(!disabled.value.includes("cexdex") ? [x.cexDexArbVolume] : []),
        ...(!disabled.value.includes("within")
          ? [x.sandwichVolume_LossWithin]
          : []),
        ...(!disabled.value.includes("outside")
          ? [x.sandwichVolume_LossOutside]
          : []),
      ],
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newDataSerie.length > 0) {
    series.data.setData(newDataSerie);
  }

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    ref="card"
    title="MEV"
    :loading
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
      <div style="display: flex; flex-wrap: wrap; gap: 2rem">
        <Legend
          :items
          :disabled
          @toggle="toggles[$event].value = !toggles[$event].value"
        />

        <div class="time">
          <span>Duration:</span>
          <SelectDuration
            :duration="timeDuration"
            @select="timeDuration = $event"
          />
        </div>

        <div class="time">
          <span>Interval:</span>
          <SelectDuration
            :duration="timeInterval"
            @select="timeInterval = $event"
          />
        </div>
      </div>
    </template>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<style scoped>
.time {
  display: flex;
  align-items: center;
  gap: 1rem;

  .select {
    min-width: 10rem;
    z-index: 3;
  }
}
</style>
