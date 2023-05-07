import { ColorsLAFDark, ColorsLAFDarkArray } from "@/Styles/Themes/LAF/Dark";
import { mergeWith } from "lodash";

type Theme = {
  colors: {
    blue: string;
    yellow: string;
    green: string;
    red: string;
    purple: string;

    backgroundColor: string;
    level1: string;
    level2: string;
    level3: string;
    level4: string;
    level5: string;
    level6: string;

    text: string;
  };
  colorsArray: string[];
};

const createDefault = (theme: Theme): object => ({
  chart: {
    id: "chart",
    background: "transparant",
    foreColor: theme.colors.level5,
    fontFamily: "SF Mono, Consolas, monospace",
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
    padding: {
      top: 20,
    },
    xaxis: {
      lines: {
        show: false,
      },
    },
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
