<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStylesApex";
import { WrapperService, type Contract } from "@PM/Services";

const { t } = useI18n();

const prismaService = new WrapperService();

const { contract } = defineProps<{
  contract: Contract;
}>();

// Data
const { isFetching: loading, data } = useQuery({
  queryKey: ["prisma-wrapper-distribution", computed(() => contract)] as const,
  queryFn: ({ queryKey: [, contract] }) =>
    prismaService.getDistribution(contract).then((x) => x.distribution),
  initialData: [],
  initialDataUpdatedAt: 0,
});

const options = computed(() => {
  return createChartStyles({
    chart: {
      type: "bar",
      animations: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: categories.value,
      labels: {
        formatter: formatterX,
        rotate: -60,
      },
      tickPlacement: "on",
    },
    yaxis: {
      labels: {
        formatter: formatterY,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "50%",
      },
    },
    legend: {
      show: true,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      followCursor: false,
      enabled: true,
      intersect: true,
    },
  });
});

const categories = computed((): string[] => data.value.map((x) => x.label));

const series = computed((): { name: string; data: number[] }[] => [
  {
    name: t("size"),
    data: Object.values(data.value).map((x) => x.value),
  },
]);

// Methods
const formatterX = (x: string) => x;
const formatterY = (y: number) => `$${round(y, 0, "dollar")}${unit(y)}`;
</script>

<template>
  <Card
    :title="t('title')"
    :loading
  >
    <ChartApex
      :options
      :series
    ></ChartApex>
  </Card>
</template>

<style scoped>
.chart {
  height: 300px;
}
</style>

<i18n lang="yaml" locale="en">
title: Position size
size: Size
</i18n>
