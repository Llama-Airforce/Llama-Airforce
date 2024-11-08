import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

import type AutoImport from "unplugin-auto-import/vite";
import type Components from "unplugin-vue-components/vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const autoImport: Parameters<typeof AutoImport>[0] = {
  include: [/\.vue$/, /\.ts$/],
  dts: resolve(__dirname, "../auto-imports.d.ts"),
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
    {
      from: "@/Framework/Series/StackedAreaSeries/Options",
      imports: ["StackedAreaSeriesOptions", "StackedAreaSeriesPartialOptions"],
      type: true,
    },
    {
      from: "@/Framework/Series/StackedAreaSeries/Data",
      imports: ["StackedAreaData"],
      type: true,
    },
    {
      from: "@/Framework/Series/StackedBarsSeries/Options",
      imports: ["StackedBarsSeriesOptions", "StackedBarsSeriesPartialOptions"],
      type: true,
    },
    {
      from: "@/Framework/Series/StackedBarsSeries/Data",
      imports: ["StackedBarsData"],
      type: true,
    },
    // Util
    {
      from: "@/Framework/Types/DataPoint",
      imports: ["DataPoint"],
      type: true,
    },
    {
      from: "@/Framework/Types/Util",
      imports: ["Tail", "Flatten", "MaybeArray", "TemplateRef"],
      type: true,
    },
    // Vue Types
    {
      from: "vue",
      imports: ["MaybeRef"],
      type: true,
    },
  ],
  dirs: [
    "../../Framework/Types/**",
    "../../Framework/Composables/**",
    "../../Util/**",
  ],
  eslintrc: {
    enabled: true,
    filepath: resolve(__dirname, "../.eslintrc-auto-import.json"),
  },
};

export const vueImport: Parameters<typeof Components>[0] = {
  dts: resolve(__dirname, "../components.d.ts"),
  dirs: ["../../Framework/Components", "../../Framework/Monitor"],
  resolvers: [
    (componentName) => {
      if (componentName.startsWith("Lucide")) {
        return {
          name: componentName.slice(6),
          from: "lucide-vue-next",
        };
      }

      return;
    },
  ],
};
