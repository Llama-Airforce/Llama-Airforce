<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";
import { useSettingsStore } from "@PM/Stores";
import { WrapperService, type Contract } from "@PM/Services";

const { t } = useI18n();

const prismaService = new WrapperService();

const { contract } = defineProps<{
  contract: Contract;
}>();

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

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions({
    localization: {
      priceFormatter: (price: number) => formatter(price),
    },
  }),
  series: {
    type: "Area",
    name: "apr" as const,
    options: computed<AreaSeriesPartialOptions>(() => ({
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
    })),
  },
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.apr) {
    return;
  }

  const newSerie = data.value
    // Filter super high APR at the start.
    .filter((x) => x.timestamp >= 1699630610)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.total_apr * 100,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newSerie.length > 0) {
    series.apr.setData(newSerie);
  }

  chart.value.timeScale().fitContent();
}

function formatter(y: number) {
  return `${round(y, 0, "percentage")}${unit(y, "percentage")}`;
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
title: APR
</i18n>
