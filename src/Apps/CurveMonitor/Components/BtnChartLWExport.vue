<script setup lang="ts">
import type { ISeriesApi, UTCTimestamp, Time } from "lightweight-charts";

// We only support series whose data is of type SingleValueData.
type Series = Record<
  string,
  ISeriesApi<"Area" | "Histogram" | "Line"> | undefined
>;

const { series } = defineProps<{
  series: Series;
}>();

/**
 * Converts various time formats to a UTC timestamp.
 *
 * @param time - The time to convert. Can be a number (UTC timestamp), string (ISO date), or object with year, month, day.
 * @returns UTCTimestamp - The converted UTC timestamp.
 * @throws Error if the time format is invalid.
 *
 * @example
 * toUTCTimestamp(1625097600) // Returns 1625097600
 * toUTCTimestamp('2021-07-01T00:00:00Z') // Returns 1625097600
 * toUTCTimestamp({ year: 2021, month: 7, day: 1 }) // Returns 1625097600
 */
function toUTCTimestamp(time: Time): UTCTimestamp {
  if (typeof time === "number") {
    return time;
  }

  if (typeof time === "string") {
    return Math.floor(new Date(time).getTime() / 1000) as UTCTimestamp;
  }

  if (typeof time === "object" && "year" in time) {
    const { year, month, day } = time;

    return Math.floor(
      new Date(year, month - 1, day).getTime() / 1000
    ) as UTCTimestamp;
  }

  throw new Error("Invalid time format");
}

/**
 * Converts series data to an exportable format.
 *
 * @param series - Record of series, keyed by column name
 * @returns Array of objects containing column name and formatted data
 *
 * @example
 * const series = {
 *   price: lineSeries,
 *   volume: histogramSeries
 * };
 * const exportData = exportLightweightChartSeries(series);
 * // Result:
 * // [
 * //   {
 * //     column: 'price',
 * //     data: [
 * //       { time: 1625097600, value: 35000 },
 * //       { time: 1625184000, value: 34500 }
 * //     ]
 * //   },
 * //   {
 * //     column: 'volume',
 * //     data: [
 * //       { time: 1625097600, value: 1000 },
 * //       { time: 1625184000, value: 1200 }
 * //     ]
 * //   }
 * // ]
 */
function exportLightweightChartSeries(series: Series) {
  return Object.entries(series).map(([column, serie]) => ({
    column,
    data: (serie?.data() ?? []).map((data) => ({
      time: toUTCTimestamp(data.time),
      value: "value" in data ? data.value : 0,
    })),
  }));
}

/**
 * Exports chart data as a CSV file.
 *
 * This function processes the chart series data, formats it into CSV,
 * and triggers a download of the resulting file.
 */
function exportData() {
  const seriesData = exportLightweightChartSeries(series);

  const rows = seriesData
    .flatMap((serie) =>
      serie.data.map((data) => ({
        column: serie.column,
        data,
      }))
    )
    .groupBy((x) => x.data.time)
    .entries()
    .orderBy(([time]) => Number(time))
    .map(([time, points]) => {
      const xs = points
        .orderBy((x) => x.column)
        .map((x) => x.data.value)
        .join(";");

      return `${time};${xs}`;
    });

  const headers = seriesData
    .map((x) => x.column)
    .orderBy((x) => x)
    .join(";");

  const csvContent = ["time;" + headers, ...rows].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "market_supply_data.csv";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
</script>

<template>
  <Button @click="exportData">
    <i class="fas fa-download"></i>
  </Button>
</template>
