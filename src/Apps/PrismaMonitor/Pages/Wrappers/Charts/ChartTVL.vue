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
  type DecimalTimeSeries,
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
  queryKey: ["prisma-wrapper-tvl", computed(() => contract)] as const,
  queryFn: ({ queryKey: [, contract] }) =>
    prismaService.getTVL(contract).then((x) => x.tvl),
  initialData: [],
  initialDataUpdatedAt: 0,
});

// Chart
const { theme } = storeToRefs(useSettingsStore());

const { chart, chartRef, series } = useLightweightChart({
  recreateChartTrigger: theme,
  createChartOptions: (chartRef) =>
    createChartStyles(chartRef, theme.value, {
      localization: {
        priceFormatter: (y: number): string =>
          `$${round(y, 0, "dollar")}${unit(y, "dollar")}`,
      },
    }),
  series: {
    type: "Area",
    name: "tvl" as const,
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
function createSeries([data, chart]: [DecimalTimeSeries[]?, IChartApi?]): void {
  if (!chart || !series.tvl) {
    return;
  }

  const newSerie: LineData[] = chain(data)
    .filter((x) => x.value > 0)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.value,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newSerie.length > 0) {
    series.tvl.setData(newSerie);
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
title: TVL
</i18n>
