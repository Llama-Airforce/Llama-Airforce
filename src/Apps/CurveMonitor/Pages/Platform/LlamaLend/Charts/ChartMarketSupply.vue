<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading
  >
    <template #actions>
      <div class="actions">
        <Legend :items="legend"></Legend>
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
let utilSerie: ISeriesApi<"Line">;

const { theme } = storeToRefs(useSettingsStore());

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    supplySerie = chart.addLineSeries(createOptionsSerieSupply());
    debtSerie = chart.addLineSeries(createOptionsSerieDebt());
    utilSerie = chart.addLineSeries(createOptionsSerieUtil());
  }
);

const legend = computed(() => [
  {
    id: "supply",
    label: t("supply"),
    color: theme.value.colors.blue,
  },
  {
    id: "debt",
    label: t("debt"),
    color: theme.value.colors.yellow,
  },
  {
    id: "util",
    label: t("util"),
    color: theme.value.colors.purple,
  },
]);

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
  utilSerie.applyOptions(createOptionsSerieUtil());
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
    leftPriceScale: {
      visible: true,
    },
  });
}

function createOptionsSerieSupply(): LineSeriesPartialOptions {
  return {
    priceFormat: {
      type: "custom",
      formatter: (x: number) => formatterPrice(x),
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
      type: "custom",
      formatter: (x: number) => formatterPrice(x),
      minMove: 0.01,
    },
    lineWidth: 2,
    color: theme.value.colors.yellow,
    lastValueVisible: false,
    priceLineVisible: false,
  };
}

function createOptionsSerieUtil(): LineSeriesPartialOptions {
  return {
    priceFormat: {
      type: "custom",
      formatter: (x: number) => formatterUtil(x),
      minMove: 0.01,
    },
    priceScaleId: "left",
    lineWidth: 2,
    color: theme.value.colors.purple,
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

  const newUtilSerie: LineData[] = chain_(newSupplySerie)
    .zip(newDebtSerie)
    .filter((x) => !!x[1])
    .map(([supply, debt]) => {
      return {
        time: debt!.time,
        value: supply && supply.value > 0 ? debt!.value / supply.value : 0,
      };
    })
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newSupplySerie.length > 0) {
    supplySerie.setData(newSupplySerie);
  }

  if (newDebtSerie.length > 0) {
    debtSerie.setData(newDebtSerie);
  }

  if (newUtilSerie.length > 0) {
    utilSerie.setData(newUtilSerie);
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

const formatterPrice = (x: number): string =>
  `$${round(x, 0, "dollar")}${unit(x, "dollar")}`;

const formatterUtil = (x: number): string => `${Math.round(x * 100)}%`;
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
util: Util (%)
</i18n>
