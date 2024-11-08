import {
  type ChartOptions,
  type DeepPartial,
  ColorType,
  LineStyle,
} from "lightweight-charts";
import { deepMerge } from "@/Utils/Object";
import type { Theme } from "@/Styles/Theme";

const createDefault = (
  chartRef: HTMLElement,
  theme: Theme
): DeepPartial<ChartOptions> => {
  const { colors } = theme;

  return {
    width: chartRef.clientWidth,
    height: chartRef.clientHeight || 300,
    rightPriceScale: {
      borderVisible: false,
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
    leftPriceScale: {
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
    layout: {
      background: {
        type: ColorType.Solid,
        color: colors.backgroundColor,
      },
      textColor: colors.level5,
      fontFamily:
        "ui-monospace, SFMono-Regular, SF Mono, Menlo, Monaco, Consolas, monospace",
      attributionLogo: false,
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
    timeScale: {
      borderVisible: false,
      fixLeftEdge: true,
      fixRightEdge: true,
    },
    handleScale: false,
    handleScroll: false,
  };
};

export default function createChartOptions(
  options?: MaybeRef<DeepPartial<ChartOptions>>
) {
  const theme = useTheme();

  return (chartRef: HTMLElement) =>
    computed(() => {
      const _default = createDefault(chartRef, theme.value);

      return options ? deepMerge(_default, toRef(options).value) : _default;
    });
}
