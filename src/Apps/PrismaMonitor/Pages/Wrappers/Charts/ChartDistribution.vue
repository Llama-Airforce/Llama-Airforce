<template>
  <CardChart
    class="chart"
    :title="t('title')"
    :loading="loading"
    :options="options"
    :series="series"
  ></CardChart>
</template>

<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStyles";
import { WrapperService, type Contract } from "@PM/Services";
import { useSettingsStore } from "@PM/Stores";

const { t } = useI18n();

const prismaService = new WrapperService(useHost());

// Props
interface Props {
  contract: Contract;
}

const { contract } = defineProps<Props>();

// Refs
const { theme } = storeToRefs(useSettingsStore());

// Data
const { isFetching: loading, data } = useQuery({
  queryKey: ["prisma-wrapper-distribution", computed(() => contract)] as const,
  queryFn: ({ queryKey: [, contract] }) =>
    prismaService.getDistribution(contract).then((x) => x.distribution),
  initialData: [],
  initialDataUpdatedAt: 0,
});

const options = computed(() => {
  return createChartStyles(theme.value, {
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
const formatterX = (x: string): string => x;

const formatterY = (y: number): string =>
  `$${round(y, 0, "dollar")}${unit(y, "dollar")}`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.cart-chart {
  ::v-deep(.card-body) {
    @media only screen and (max-width: 1280px) {
      height: 300px;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Position size
size: Size
</i18n>
