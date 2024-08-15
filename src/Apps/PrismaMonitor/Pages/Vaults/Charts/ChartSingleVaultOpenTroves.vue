<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading="loading"
  >
    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import { useSettingsStore } from "@PM/Stores";
import createChartStyles from "@PM/Util/ChartStyles";
import {
  ManagerService,
  type TroveManagerDetails,
  type DecimalTimeSeries,
} from "@PM/Services";

const { t } = useI18n();

// Props
interface Props {
  vault?: TroveManagerDetails | null;
}
const { vault = null } = defineProps<Props>();

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
const { chart, chartRef, series } = useLightweightChart({
  recreateChartTrigger: theme,
  createChartOptions: (chartRef) =>
    createChartStyles(chartRef, theme.value, {
      height: 300,
    }),
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

watch([data, chart], createSeries);
function createSeries([globalCr, chart]: [
  DecimalTimeSeries[]?,
  IChartApi?
]): void {
  if (!chart || !series.troves) {
    return;
  }

  const newGlobalCrSerie: LineData[] = chain(globalCr)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.value,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newGlobalCrSerie.length > 0) {
    series.troves.setData(newGlobalCrSerie);
  }

  chart.timeScale().fitContent();
}
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart-container {
  :deep(.card-body) {
    flex-direction: column;
    justify-content: center;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Number of open troves
</i18n>
