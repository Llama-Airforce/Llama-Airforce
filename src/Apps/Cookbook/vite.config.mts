import path from "path";
import { defineConfig, splitVendorChunkPlugin } from "vite";
import vue from "@vitejs/plugin-vue";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";

export default defineConfig(() => {
  return {
    plugins: [
      vue({ script: { propsDestructure: true } }),
      VueI18nPlugin({
        strictMessage: false,
        escapeHtml: false,
      }),
      splitVendorChunkPlugin(),
      AutoImport({
        include: [/\.vue?$/],
        dts: true,
        imports: [
          "vue",
          "vue-i18n",
          "vue-router",
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
      }),
      Components({ dts: true, dirs: ["../../Framework"] }),
    ],
    server: {
      port: 8080,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "../../"),
        "@CB": path.resolve(__dirname, "./"),
      },
    },
    build: {
      rollupOptions: {
        plugins: [
          /*
           * Enable rollup polyfills plugin
           * used during production bundling
           */
          rollupNodePolyFill(),
        ],
      },
    },
  };
});
