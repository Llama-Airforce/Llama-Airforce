import type AutoImport from "unplugin-auto-import/vite";

export const autoImport: Parameters<typeof AutoImport>[0] = {
  include: [/\.vue$/, /\.ts$/],
  dts: true,
  imports: [
    // Vue
    "vue",
    "vue-i18n",
    "vue-router",
    "@vueuse/core",
    "pinia",
    { "@vueuse/router": ["useRouteHash", "useRouteParams", "useRouteQuery"] },
    // New in Vue 3.5
    { vue: ["useTemplateRef"] },
    // Vue plugins
    { "@tanstack/vue-query": ["useQuery", "useQueries", "useQueryClient"] },
    { "@kyvg/vue3-notification": ["notify"] },
    // Viem + wagmi
    { viem: ["getAddress", "isAddress", "getContract"] },
    {
      "@wagmi/vue": [
        "useConfig",
        "useReadContract",
        "useWriteContract",
        "useWaitForTransactionReceipt",
        "useSwitchChain",
        "useBalance",
      ],
    },
    {
      "@wagmi/core": [
        "getPublicClient",
        "readContract",
        "simulateContract",
        "writeContract",
        "waitForTransactionReceipt",
      ],
    },
    { from: "@wagmi/core", imports: ["Config"], type: true },
    // Charting
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
    // Util
    {
      from: "@/Util",
      imports: ["DataPoint"],
      type: true,
    },
    {
      from: "@/Util/Types",
      imports: ["Tail", "Flatten", "MaybeArray"],
      type: true,
    },
    // Vue Types
    {
      from: "vue",
      imports: ["MaybeRef"],
      type: true,
    },
  ],
  dirs: ["../../Framework/**", "../../Util/**"],
  eslintrc: {
    enabled: true,
  },
};
