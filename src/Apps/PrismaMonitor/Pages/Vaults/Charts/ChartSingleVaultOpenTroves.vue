<script setup lang="ts">
import { useSettingsStore } from "@PM/Stores";
import createChartStyles from "@PM/Util/ChartStyles";
import { ManagerService, type TroveManagerDetails } from "@PM/Services";

const { t } = useI18n();

const { vault = null } = defineProps<{
  vault?: TroveManagerDetails | null;
}>();

// Refs
const { theme, flavor } = storeToRefs(useSettingsStore());

// Services
const managerService = new ManagerService(flavor.value);

// Data
const { isFetching: loading, data } = useQuery({
  queryKey: [
    "prisma-vault-trove-count",
    computed(() => vault?.address),
  ] as const,
  queryFn: ({ queryKey: [, vault] }) => {
    if (vault) {
      return managerService
        .getVaultTroveCount("ethereum", vault, "1m")
        .then((x) => x.count);
    } else {
      return Promise.resolve([]);
    }
  },
  initialData: [],
  initialDataUpdatedAt: 0,
});

// Chart
const { chart, series } = useLightweightChart({
  createChartOptions: (chartRef) =>
    computed(() => createChartStyles(chartRef, theme.value)),
  series: {
    type: "Area",
    name: "troves" as const,
    options: computed(
      (): AreaSeriesPartialOptions => ({
        priceFormat: {
          type: "price",
          precision: 0,
          minMove: 0.1,
        },
        lineWidth: 2,
        lineType: LineType.WithSteps,
        lastValueVisible: false,
        priceLineVisible: false,
        ...theme.value.lineChartColors,
      })
    ),
  },
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.troves) {
    return;
  }

  const newGlobalCrSerie: LineData[] = data.value
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.value,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newGlobalCrSerie.length > 0) {
    series.troves.setData(newGlobalCrSerie);
  }

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    :title="t('title')"
    :loading="loading"
  >
    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<i18n lang="yaml" locale="en">
title: Number of open troves
</i18n>
