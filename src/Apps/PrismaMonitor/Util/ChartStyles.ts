import {
  type ChartOptions,
  type DeepPartial,
  ColorType,
  LineStyle,
} from "lightweight-charts";
import { mergeWith } from "lodash";
import { getColors } from "@/Styles/Themes/PM";
import type { Theme } from "@PM/Models/Theme";
import type { Flavor } from "@PM/Models/Flavor";

const createDefault = (
  chartRef: HTMLElement,
  theme: Theme,
  flavor: Flavor
): DeepPartial<ChartOptions> => {
  const colors = getColors(theme, flavor);

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
  flavor: Flavor,
  options: DeepPartial<ChartOptions>
): DeepPartial<ChartOptions> {
  const _default = createDefault(chartRef, theme, flavor);

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
