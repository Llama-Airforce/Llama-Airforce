import { mergeWith } from "lodash";
import { ColorsLAFDark, ColorsLAFDarkArray } from "@/Styles/Themes/LAF/Dark";
import type { Theme } from "@/Styles/Theme";

const createDefault = (theme: Theme): object => ({
  chart: {
    id: "chart",
    background: "transparant",
    foreColor: theme.colors.level5,
    fontFamily:
      "ui-monospace, SFMono-Regular, SF Mono, Menlo, Monaco, Consolas, monospace",
    toolbar: {
      autoSelected: "zoom",
      tools: {
        download: false,
        pan: false,
      },
    },
    zoom: {
      autoScaleYaxis: true,
    },
  },
  colors: theme.colorsArray,
  grid: {
    borderColor: theme.colors.level5,
    strokeDashArray: 4,
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  fill: {
    type: "solid",
    opacity: 1,
  },
  stroke: {
    curve: "smooth",
    width: 2,
  },
  theme: {
    mode: "dark",
  },
  xaxis: {
    type: "category",
    axisBorder: {
      color: theme.colors.level5,
      height: 1,
    },
    axisTicks: {
      color: theme.colors.level5,
    },
    title: {
      color: theme.colors.level5,
    },
  },
  yaxis: {
    tickAmount: 4,
    axisBorder: {
      color: theme.colors.level5,
    },
    axisTicks: {
      color: theme.colors.level5,
    },
    title: {
      color: theme.colors.level5,
    },
  },
});

export function createChartStylesLAF(options: object): object {
  const _default = createDefault({
    colors: ColorsLAFDark,
    colorsArray: ColorsLAFDarkArray,
  });

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

export function createChartStyles(theme: Theme, options: object): object {
  const _default = createDefault(theme);

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
