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
  WrapperService,
  type Contract,
  type SnapshotWrapper,
} from "@PM/Services";

const { t } = useI18n();

const prismaService = new WrapperService();

// Props
interface Props {
  contract: Contract;
}

const { contract } = defineProps<Props>();

// Data
const { isFetching: loading, data } = useQuery({
  queryKey: ["prisma-wrapper-snapshots", computed(() => contract)] as const,
  queryFn: ({ queryKey: [, contract] }) =>
    prismaService.getSnapshots(contract).then((x) => x.Snapshots),
  initialData: [],
  initialDataUpdatedAt: 0,
});

// Chart
const { theme } = storeToRefs(useSettingsStore());

const { chart, chartRef, series } = useLightweightChart({
  recreateChartTrigger: theme,
  createChartOptions: (chartRef) =>
    createChartStyles(chartRef, theme.value, {
      leftPriceScale: {
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      localization: {
        priceFormatter: (price: number) => formatter(price),
      },
    }),
  series: {
    type: "Area",
    name: "apr" as const,
    options: computed(
      (): AreaSeriesPartialOptions => ({
        priceFormat: {
          type: "price",
          precision: 6,
          minMove: 0.01,
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
function createSeries([newData, chart]: [
  SnapshotWrapper[]?,
  IChartApi?
]): void {
  if (!chart || !series.apr) {
    return;
  }

  const newSerie: LineData[] = chain(newData)
    // Filter super high APR at the start.
    .filter((x) => x.timestamp >= 1699630610)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.total_apr * 100,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newSerie.length > 0) {
    series.apr.setData(newSerie);
  }

  chart.timeScale().fitContent();
}

const formatter = (y: number): string => {
  return `${round(y, 0, "percentage")}${unit(y, "percentage")}`;
};
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
title: APR
</i18n>
