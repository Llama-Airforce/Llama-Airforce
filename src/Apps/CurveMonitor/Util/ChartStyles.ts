import {
  type ChartOptions,
  type DeepPartial,
  ColorType,
  LineStyle,
} from "lightweight-charts";
import { mergeWith } from "lodash";
import type { Theme } from "@/Styles/Theme";

const createDefault = (
  chartRef: HTMLElement,
  theme: Theme
): DeepPartial<ChartOptions> => {
  const { colors } = theme;

  return {
    width: chartRef.clientWidth,
    height: chartRef.clientHeight,
    layout: {
      background: {
        type: ColorType.Solid,
        color: colors.backgroundColor,
      },
      textColor: colors.level5,
      fontFamily:
        "ui-monospace, SFMono-Regular, SF Mono, Menlo, Monaco, Consolas, monospace",
    },
    grid: {
      vertLines: {
        visible: false,
      },
      horzLines: {
        color: colors.level4,
        style: LineStyle.SparseDotted,
      },
    },
    rightPriceScale: {
      borderVisible: false,
    },
    timeScale: {
      borderVisible: false,
      fixLeftEdge: true,
      fixRightEdge: true,
    },
    handleScale: false,
    handleScroll: false,
  };
};

export default function createChartStyles(
  chartRef: HTMLElement,
  theme: Theme,
  options: DeepPartial<ChartOptions>
): DeepPartial<ChartOptions> {
  const _default = createDefault(chartRef, theme);

  const mergeFunction = (objValue: unknown, srcValue: unknown) => {
    if (typeof srcValue === "object") {
      mergeWith(objValue, srcValue, mergeFunction);
      return undefined;
    } else if (objValue) {
      return objValue;
    } else {
      return srcValue;
    }
  };

  return mergeWith(options, _default, mergeFunction);
}
