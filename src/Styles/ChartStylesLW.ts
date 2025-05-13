import {
  type ChartOptions,
  type DeepPartial,
  ColorType,
  LineStyle,
  type AutoscaleInfo,
} from "lightweight-charts";
import type { Theme } from "@/Styles/Theme";
import { deepMerge } from "@/Utils/Object";

export const DEFAULT_MIN_HEIGHT = 300;

const createDefault = (
  chartRef: HTMLElement,
  theme: Theme
): DeepPartial<ChartOptions> => {
  const { colors } = theme;

  return {
    width: chartRef.clientWidth,
    height: chartRef.clientHeight || DEFAULT_MIN_HEIGHT,
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

/**
 * Creates an area series configuration for a lightweight chart
 *
 * @param name Unique identifier for the series
 * @param color Reactive color reference for the series
 * @param formatter Custom formatter for data values or predefined format type.
 * Can be a custom function or one of: "price", "percent", "volume"
 * @param minMove Minimal step of price change (e.g. 0.01 for 2 decimal places)
 * @param precision Number of decimal places for formatted values
 * @returns Configuration object for an area series
 */
export function createAreaSerie<T extends string>({
  name,
  color,
  formatter,
  minMove,
  precision,
  autoscaleInfoProvider,
}: {
  name: T;
  color: Ref<string>;
  formatter?: ((x: number) => string) | "price" | "percent" | "volume";
  minMove?: number;
  precision?: number;
  autoscaleInfoProvider?: () => AutoscaleInfo | null;
}) {
  const options = computed<AreaSeriesPartialOptions>(() => ({
    priceFormat: {
      type: typeof formatter !== "function" ? formatter ?? "custom" : "custom",
      formatter: typeof formatter === "function" ? formatter : undefined,
      minMove,
      precision,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    lineColor: color.value,
    topColor: `${color.value}44`,
    bottomColor: `${color.value}00`,
    lastValueVisible: false,
    priceLineVisible: false,
    autoscaleInfoProvider,
  }));

  return {
    type: AreaSeries,
    name,
    options,
  } as const;
}
