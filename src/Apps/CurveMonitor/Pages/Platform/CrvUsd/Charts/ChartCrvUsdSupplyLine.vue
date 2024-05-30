<template>
  <div
    ref="chartRef"
    class="chart"
  ></div>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";
import { type CrvUsdSupply } from "@CM/Services/CrvUsd";

// Props
interface Props {
  data: CrvUsdSupply[];
}

const { data = [] } = defineProps<Props>();

// Refs
let supplySerie: ISeriesApi<"Area">;
let debtSerie: ISeriesApi<"Line">;

const { theme } = storeToRefs(useSettingsStore());

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    supplySerie = chart.addAreaSeries(createSupplyOptionsSerie());
    debtSerie = chart.addLineSeries(createDebtOptionsSerie());
  }
);

// Watches
watch([() => data, chart], createSeries);
watch(theme, () => {
  supplySerie.applyOptions(createSupplyOptionsSerie());
  debtSerie.applyOptions(createDebtOptionsSerie());
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
  });
}

function createSupplyOptionsSerie(): AreaSeriesPartialOptions {
  return {
    priceFormat: {
      type: "custom",
      formatter,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    lineColor: theme.value.colors.blue,
    topColor: "rgb(32, 129, 240, 0.2)",
    bottomColor: "rgba(32, 129, 240, 0)",
    lastValueVisible: false,
    priceLineVisible: false,
  };
}

function createDebtOptionsSerie(): LineSeriesPartialOptions {
  return {
    priceFormat: {
      type: "custom",
      formatter,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    color: theme.value.colors.yellow,
    lastValueVisible: false,
    priceLineVisible: false,
  };
}

function createSeries([newSupply, chart]: [CrvUsdSupply[]?, IChartApi?]): void {
  if (!chart || !supplySerie) {
    return;
  }

  const newSupplySerie: (LineData & { debt: number })[] = chain(newSupply)
    .groupBy((x) => x.timestamp)
    .mapValues((x) => ({
      time: x[0].timestamp as UTCTimestamp,
      value: x.reduce((acc, y) => acc + y.supply, 0),
      debt: x.find((y) => y.market === "Keepers debt")?.supply ?? 0,
    }))
    .entries()
    .map((x) => x[1])
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  const newDebtSerie: LineData[] = newSupplySerie.map((x) => ({
    time: x.time,
    value: x.value - x.debt,
  }));

  if (newSupplySerie.length > 0) {
    supplySerie.setData(newSupplySerie);
  }

  if (newDebtSerie.length > 0) {
    debtSerie.setData(newDebtSerie);
  }

  chart.timeScale().fitContent();
}

const formatter = (y: number): string =>
  `${round(y, 0, "dollar")}${unit(y, "dollar")}`;
</script>
