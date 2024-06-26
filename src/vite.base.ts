import type AutoImport from "unplugin-auto-import/vite";

export const autoImport: Parameters<typeof AutoImport>[0] = {
  include: [/\.vue$/, /\.ts$/],
  dts: true,
  imports: [
    "vue",
    "vue-i18n",
    "vue-router",
    "@vueuse/core",
    "pinia",
    { "@vueuse/router": ["useRouteHash", "useRouteParams", "useRouteQuery"] },
    { "@tanstack/vue-query": ["useQuery", "useQueries"] },
    {
      from: "lightweight-charts",
      imports: ["LineType", "LineStyle", "ColorType", "CrosshairMode"],
      type: false,
    },
    {
      from: "lightweight-charts",
      imports: [
        "IChartApi",
        "ISeriesApi",
        "UTCTimestamp",
        "LineData",
        "CandlestickData",
        "CandlestickSeriesPartialOptions",
        "HistogramData",
        "HistogramSeriesPartialOptions",
        "AreaSeriesPartialOptions",
        "LineSeriesPartialOptions",
      ],
      type: true,
    },
    {
      from: "@/Util",
      imports: ["DataPoint"],
      type: true,
    },
  ],
  dirs: ["../../Framework/**", "../../Util/**"],
  eslintrc: {
    enabled: true,
  },
};
