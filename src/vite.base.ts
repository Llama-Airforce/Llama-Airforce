import type AutoImport from "unplugin-auto-import/vite";

export const autoImport: Parameters<typeof AutoImport>[0] = {
  include: [/\.vue?$/],
  dts: true,
  imports: [
    "vue",
    "vue-i18n",
    "vue-router",
    { "@tanstack/vue-query": ["useQuery"] },
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
  ],
  dirs: ["../../Framework/**"],
  eslintrc: {
    enabled: true,
  },
};
