<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading
  >
    <template #actions>
      <div class="actions">
        <Legend
          :items="[t('supply'), t('debt')]"
          :colors="colorsLegend"
        ></Legend>
      </div>
    </template>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<script setup lang="ts">
import { chain as chain_ } from "lodash";
import { type Chain } from "@CM/Models/Chain";
import { useSettingsStore } from "@CM/Stores";
import { useQuerySnapshots } from "@CM/Services/LlamaLend/Queries";
import createChartStyles from "@CM/Util/ChartStyles";
import { type Market, type Snapshot } from "@CM/Services/LlamaLend";

const { t } = useI18n();

// Props
interface Props {
  market: Market | undefined;
  chain: Chain | undefined;
}

const { market, chain } = defineProps<Props>();

// Refs
let supplySerie: ISeriesApi<"Line">;
let debtSerie: ISeriesApi<"Line">;

const { theme } = storeToRefs(useSettingsStore());

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    supplySerie = chart.addLineSeries(createOptionsSerieSupply());
    debtSerie = chart.addLineSeries(createOptionsSerieDebt());
  }
);

const colorsLegend = computed(() => {
  const { colors } = theme.value;

  return [colors.blue, colors.yellow];
});

// Data
const { isFetching: loading, data: snapshots } = useQuerySnapshots(
  toRef(() => market),
  toRef(() => chain)
);

// Watches
watch([snapshots, chart], createSeries);
watch(theme, () => {
  supplySerie.applyOptions(createOptionsSerieSupply());
  debtSerie.applyOptions(createOptionsSerieDebt());
});

// Chart
function createOptionsChart(chartRef: HTMLElement) {
  return createChartStyles(chartRef, theme.value, {
    height: 300,
    rightPriceScale: {
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
    localization: {
      priceFormatter: (apy: number) => formatterApy(apy),
    },
  });
}

function createOptionsSerieSupply(): LineSeriesPartialOptions {
  return {
    priceFormat: {
      type: "price",
      precision: 2,
      minMove: 0.01,
    },
    lineWidth: 2,
    color: theme.value.colors.blue,
    lastValueVisible: false,
    priceLineVisible: false,
  };
}

function createOptionsSerieDebt(): LineSeriesPartialOptions {
  return {
    priceFormat: {
      type: "price",
      precision: 2,
      minMove: 0.01,
    },
    lineWidth: 2,
    color: theme.value.colors.yellow,
    lastValueVisible: false,
    priceLineVisible: false,
  };
}

function createSeries([newSnapshots, chart]: [Snapshot[]?, IChartApi?]): void {
  if (!chart || !supplySerie || !debtSerie) {
    return;
  }

  const newSupplySerie: LineData[] = chain_(newSnapshots)
    .map((c) => ({
      time: c.timestamp as UTCTimestamp,
      value: c.totalAssetsUsd,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  const newDebtSerie: LineData[] = chain_(newSnapshots)
    .map((c) => ({
      time: c.timestamp as UTCTimestamp,
      value: c.totalDebtUsd,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  // Borrow APY serie
  if (newSupplySerie.length > 0) {
    supplySerie.setData(newSupplySerie);
  }

  // Lend APY serie
  if (newDebtSerie.length > 0) {
    debtSerie.setData(newDebtSerie);
  }

  if (newSupplySerie.length > 0 || newDebtSerie.length > 0) {
    const from = Math.min(
      (newSupplySerie[0]?.time as UTCTimestamp) ?? Infinity,
      (newDebtSerie[0]?.time as UTCTimestamp) ?? Infinity
    ) as UTCTimestamp;

    const to = Math.max(
      (newSupplySerie[newSupplySerie.length - 1]?.time as UTCTimestamp) ??
        -Infinity,
      (newDebtSerie[newDebtSerie.length - 1]?.time as UTCTimestamp) ?? -Infinity
    ) as UTCTimestamp;

    chart.timeScale().setVisibleRange({ from, to });
  }
}

const formatterApy = (x: number): string =>
  `$${round(x, 2, "dollar")}${unit(x, "dollar")}`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart-container {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: center;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Supply & Debt
supply: Supply
debt: Debt
</i18n>
