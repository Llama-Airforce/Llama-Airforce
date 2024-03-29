<template>
  <CardGraph
    class="emissions"
    :title="title"
    :options="options"
    :series="series"
  >
  </CardGraph>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { CardGraph } from "@/Framework";
import { round, unit, formatNumber, shorten, type DataPoint } from "@/Util";
import { createChartStyles } from "@/Styles/ChartStyles";
import { getColors, getColorsArray } from "@/Styles/Themes/CM";
import { type Gauge } from "@CM/Pages/Platform/Gauges/Models/Gauge";
import { type Fee } from "@CM/Pages/Platform/Gauges/Models/Fee";
import { type Emission } from "@CM/Pages/Platform/Gauges/Models/Emission";
import { useCurveStore } from "@CM/Pages/Platform/Store";
import { useSettingsStore } from "@CM/Stores";
import { aggregateDataPoints } from "@CM/Pages/Platform/Gauges/Util/SnapshotHelper";

type Serie = {
  name: string;
  type: string;
  data: { x: number; y: number }[];
};

// Props
interface Props {
  gaugeSelected: Gauge;
}

const { gaugeSelected } = defineProps<Props>();

const { t } = useI18n();

// Refs
const store = useCurveStore();
const storeSettings = useSettingsStore();

const title = computed((): string => {
  let title = t("title");
  if (gaugeSelected) {
    title += ` - ${shorten(gaugeSelected.name)}`;
  }

  return title;
});

const emissions = computed((): Emission[] => {
  return gaugeSelected ? store.emissions[gaugeSelected.name] ?? [] : [];
});

const fees = computed((): Fee[] => {
  return gaugeSelected ? store.fees[gaugeSelected.name] ?? [] : [];
});

const yMin = computed((): number => {
  return Math.min(
    ...aggregateDataPoints(emissions.value)
      .map((e) => e.value)
      .concat(aggregateDataPoints(fees.value).map((f) => f.value))
  );
});

const yMax = computed((): number => {
  return Math.max(
    ...aggregateDataPoints(emissions.value)
      .map((e) => e.value)
      .concat(aggregateDataPoints(fees.value).map((f) => f.value))
      .map((x) => Math.abs(x))
  );
});

// eslint-disable-next-line max-lines-per-function
const options = computed((): unknown => {
  const colors = getColors(storeSettings.theme);
  const colorsArray = getColorsArray(storeSettings.theme);

  return createChartStyles(
    { colors, colorsArray },
    {
      chart: {
        id: "curve-emissions",
        animations: {
          enabled: false,
        },
        toolbar: {
          tools: {
            download: true,
          },
        },
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: [
        {
          seriesName: "emissions",
          tickAmount: 4,
          labels: {
            formatter: (y: number): string => formatterEmissions(y),
          },
          min: yMin,
          max: yMax,
        },
        {
          seriesName: "emissions",
          tickAmount: 4,
          labels: {
            formatter: (y: number): string => formatterFees(y),
          },
          show: false,
          min: yMin,
          max: yMax,
        },
      ],
      plotOptions: {
        bar: {
          distributed: false,
          dataLabels: {
            position: "top",
            hideOverflowingLabels: false,
          },
        },
      },
      tooltip: {
        followCursor: false,
        enabled: true,
        intersect: false,
        custom: (x: DataPoint<Serie>) => {
          const emissions =
            x.w.globals.initialSeries[0].data[x.dataPointIndex].y;

          const fees = x.w.globals.initialSeries[1].data[x.dataPointIndex]
            ? x.w.globals.initialSeries[1].data[x.dataPointIndex].y
            : 0;

          const data = [
            `<div><b>${t("emissions")}</b>:</div><div>${formatterEmissions(
              emissions
            )}</div>`,
            `<div><b>${t("fees")}</b>:</div><div>${formatterFees(fees)}</div>`,
            `<div><b>${t("ratio")}</b>:</div><div>${formatterRatio(
              fees / emissions
            )}</div>`,
          ];

          return data.join("");
        },
      },
      dataLabels: {
        enabled: false,
      },
      csv: {
        filename: "emissions.csv",
        columnDelimiter: ",",
        headerCategory: "category",
        headerValue: "value",
        dateFormatter(timestamp: number) {
          return timestamp;
        },
      },
    }
  );
});

const series = computed((): Serie[] => {
  const aggregatedEmissions = aggregateDataPoints(emissions.value);
  const aggregatedFees = aggregateDataPoints(fees.value);
  interface feeIndex {
    [timeStamp: number]: number;
  }
  const indexedFees = Object.assign(
    {},
    ...aggregatedFees.map((x) => ({ [x.timeStamp]: x.value }))
  ) as feeIndex;
  return [
    {
      name: t("emissions"),
      type: "line",
      data: aggregatedEmissions.map((s) => ({
        x: s.timeStamp * 1000,
        y: s.value,
      })),
    },
    {
      name: t("fees"),
      type: "line",
      data: aggregatedEmissions.map((emissions) => ({
        x: emissions.timeStamp * 1000,
        y: indexedFees[emissions.timeStamp]
          ? Math.abs(indexedFees[emissions.timeStamp])
          : 0,
      })),
    },
  ];
});

// Methods
const formatterEmissions = (x: number): string => {
  return `$${round(Math.abs(x), 1, "dollar")}${unit(x, "dollar")}`;
};

const formatterFees = (x: number): string => {
  return `$${round(x, 1, "dollar")}${unit(x, "dollar")}`;
};

const formatterRatio = (x: number): string => {
  return `${formatNumber(x, 2)}`;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.emissions {
  ::v-deep(.card-body) {
    .apexcharts-tooltip {
      grid-template-rows: auto auto auto;
      grid-template-columns: 1fr auto;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Emissions & Revenues
emissions: Emissions
fees: Fees
ratio: Ratio
</i18n>
