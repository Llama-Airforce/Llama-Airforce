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
      from: "@/Framework/Series/StackedAreaSeries",
      imports: [
        "StackedAreaSeriesOptions",
        "StackedAreaSeriesPartialOptions",
        "StackedAreaData",
      ],
      type: true,
    },
    {
      from: "@/Framework/Series/StackedBarsSeries",
      imports: [
        "StackedBarsSeriesOptions",
        "StackedBarsSeriesPartialOptions",
        "StackedBarsData",
      ],
      type: true,
    },
  ],
  dirs: [
    "../../Types/**",
    "../../Utils/**",
    "../../Framework/Composables/**",
    "../../Framework/Monitor/**",
    "../../Framework/Stores/**",
  ],
  eslintrc: {
    enabled: true,
    filepath: resolve(__dirname, "../.eslintrc-auto-import.json"),
  },
  vueTemplate: true,
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
