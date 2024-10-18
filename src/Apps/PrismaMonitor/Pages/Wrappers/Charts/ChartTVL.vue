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
  queryKey: ["prisma-wrapper-tvl", computed(() => contract)] as const,
  queryFn: ({ queryKey: [, contract] }) =>
    prismaService.getTVL(contract).then((x) => x.tvl),
  initialData: [],
  initialDataUpdatedAt: 0,
});

// Chart
const { theme } = storeToRefs(useSettingsStore());

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions({
    localization: {
      priceFormatter: (y: number) => `$${round(y, 1, "dollar")}${unit(y)}`,
    },
  }),
  series: {
    type: "Area",
    name: "tvl" as const,
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
  if (!chart.value || !series.tvl) {
    return;
  }

  const newSerie = data.value
    .filter((x) => x.value > 0)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.value,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newSerie.length > 0) {
    series.tvl.setData(newSerie);
  }

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    :title="t('title')"
    :loading
  >
    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<i18n lang="yaml" locale="en">
title: TVL
</i18n>
