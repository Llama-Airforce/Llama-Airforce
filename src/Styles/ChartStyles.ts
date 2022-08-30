import { mergeWith } from "lodash";

// eslint-disable-next-line @typescript-eslint/ban-types
const createDefault = (): Object => ({
  chart: {
    id: "chart",
    background: "transparant",
    fontFamily: "SF Mono, Consolas, monospace",
    foreColor: "#71717A",
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
  colors: [
    "rgb(32, 129, 240)",
    "rgb(255, 204, 0)",
    "rgb(126, 217, 87)",
    "rgb(255, 87, 87)",
    "rgb(140, 82, 255)",
  ],
  grid: {
    borderColor: "#71717A",
    strokeDashArray: 4,
    padding: {
      top: 20,
    },
  },
  stroke: {
    curve: "smooth",
  },
  theme: {
    mode: "dark",
  },
  xaxis: {
    type: "category",
    axisBorder: {
      color: "#71717A",
      height: 1,
    },
    axisTicks: {
      color: "#71717A",
    },
    title: {
      color: "#71717A",
    },
  },
  yaxis: {
    tickAmount: 4,
    axisBorder: {
      color: "#71717A",
    },
    axisTicks: {
      color: "#71717A",
    },
    title: {
      color: "#71717A",
    },
  },
});

// eslint-disable-next-line @typescript-eslint/ban-types
export default function createChartStyles(options: Object): Object {
  const _default = createDefault();

  const mergeFunction = (objValue: unknown, srcValue: unknown) => {
    if (typeof srcValue === "object") {
      mergeWith(objValue, srcValue, mergeFunction);
    } else if (objValue) {
      return objValue;
    } else {
      return srcValue;
    }
  };

  return mergeWith(options, _default, mergeFunction);
}
