import { mergeWith } from "lodash";
import { ColorsDark, ColorsDarkArray } from "@/Util/Colors";

// eslint-disable-next-line @typescript-eslint/ban-types
const createDefault = (): Object => ({
  chart: {
    id: "chart",
    background: "transparant",
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
  colors: ColorsDarkArray,
  grid: {
    borderColor: ColorsDark.level5,
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
      color: ColorsDark.level5,
      height: 1,
    },
    axisTicks: {
      color: ColorsDark.level5,
    },
    title: {
      color: ColorsDark.level5,
    },
  },
  yaxis: {
    tickAmount: 4,
    axisBorder: {
      color: ColorsDark.level5,
    },
    axisTicks: {
      color: ColorsDark.level5,
    },
    title: {
      color: ColorsDark.level5,
    },
  },
});

// eslint-disable-next-line @typescript-eslint/ban-types
export default function createChartStyles(options: Object): Object {
  const _default = createDefault();

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
