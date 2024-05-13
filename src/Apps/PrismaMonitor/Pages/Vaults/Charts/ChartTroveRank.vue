<template>
  <Card
    class="chart-container"
    :title="dynamicTitle"
    :loading="loading"
  >
    <template #actions>
      <Tooltip>
        <div>
          This chart displays that amount of collateral available below
          different collateral ratios.
          <br />
          It also displays the position of the trove relative to other troves in
          this vault. <br />
          <br />
          This information is useful to estimate a trove's risk of redemption.
          <br />
          Even if the trove's collateral ratio is high in the absolute, a lower
          ratio relative <br />
          to other troves means a higher risk of redemption.<br />
          <br />
          As such, the lower the "risk rank" displayed, the higher the trove's
          risk of being redeemed.
        </div>
      </Tooltip>
    </template>

    <GraphApex
      class="chart"
      :options="options"
      :series="series"
    ></GraphApex>
  </Card>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@PM/Stores";
import {
  TroveService,
  type RatioPosition,
  type Trove,
  type TroveManagerDetails,
} from "@PM/Services";
import { createChartStyles } from "@/Styles/ChartStyles";

const { t } = useI18n();

// Stores
const { theme, flavor } = storeToRefs(useSettingsStore());

// Services
const troveService = new TroveService(getHost(), flavor.value);

// Props
interface Props {
  vault?: TroveManagerDetails | null;
  trove?: Trove | null;
}
const { vault = null, trove = null } = defineProps<Props>();

// Refs
const dynamicTitle = ref("Trove Relative Position");

const init: RatioPosition = {
  rank: null,
  total_positions: 0,
  ratio: null,
  positions: [],
};

// Data
const { isFetching: loading, data } = useQuery({
  queryKey: [
    "prisma-trove-rank",
    computed(() => vault?.address),
    computed(() => trove?.owner),
  ] as const,
  queryFn: async ({ queryKey: [, vault, owner] }) => {
    if (vault && owner) {
      const rank = await troveService.getTroveRank("ethereum", vault, owner);
      return rank;
    } else {
      return Promise.resolve(init);
    }
  },
  initialData: init,
  initialDataUpdatedAt: 0,
});

// Refs
// eslint-disable-next-line max-lines-per-function
const options = computed((): unknown => {
  const { colors } = theme.value;

  const xaxis = {
    x: data.value?.ratio ?? 0,
    borderColor: colors.yellow,
    strokeDashArray: 2,
    label: {
      borderColor: colors.yellow,
      style: {
        background: colors.yellow,
        color: "rgb(34, 34, 34)",
      },
      position: "top",
      offsetX: 15,
      text: `This trove: ${pctFormatter(data.value?.ratio ?? 0, 1)}`,
    },
  };

  return createChartStyles(theme.value, {
    chart: {
      type: "area",
      animations: {
        enabled: false,
      },
      toolbar: {
        show: true,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        type: "vertical",
        shadeIntensity: 0,
        inverseColors: false,
        opacityFrom: 0.7,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    annotations: {
      xaxis: data.value.ratio ? [xaxis] : [],
    },
    toolbar: {
      show: false,
    },
    xaxis: {
      type: "numeric",
      categories: categories.value,
      labels: {
        formatter: (x: number): string => pctFormatter(x),
      },
    },
    yaxis: {
      seriesName: "impact",
      labels: {
        formatter: (y: number): string => formatter(y),
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      shared: true,
      custom: (x: DataPoint<number>) => {
        if (!vault) {
          return "";
        }

        const amount = categories.value[x.dataPointIndex];
        const pct =
          x.dataPointIndex === categories.value.length - 1
            ? "Over 250%"
            : pctFormatter(amount);

        const tooltip = `
          <div><b>Collateral ratio:</b>:</div>
          <div>${pct}</div>

          <div><b>Troves with lower or equal ratio:</b>:</div>
          <div>${data.value.positions[x.dataPointIndex].trove_count}</div>

          <div><b>Collateral value at lower or equal ratio:</b>:</div>
          <div>$${formatter(x.series[0][x.dataPointIndex])}</div>
          `;
        return tooltip;
      },
    },
  });
});

const series = computed((): { name: string; data: number[] }[] => [
  {
    name: t("rank"),
    data: Object.values(data.value.positions).map((x) => x.collateral_usd),
  },
]);

const categories = computed(() => data.value.positions.map((x) => x.ratio));

// Methods
const formatter = (x: number): string => {
  return `${round(Math.abs(x), 1, "dollar")}${unit(x, "dollar")}`;
};

const pctFormatter = (y: number, decimals = 0): string => {
  return `${round(y, decimals, "percentage")}${unit(y, "percentage")}`;
};

// Watches
watch(
  data,
  (newData) => {
    if (newData && typeof newData.rank === "number") {
      dynamicTitle.value = t("title", {
        rank: newData.rank,
        total_positions: newData.total_positions,
      });
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart-container {
  ::v-deep(.card-body) {
    overflow-x: clip;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: "Trove Relative Position (Risk rank: {rank} / {total_positions})"
</i18n>
