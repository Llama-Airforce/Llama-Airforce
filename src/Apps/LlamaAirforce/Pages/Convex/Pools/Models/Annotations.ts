import { ColorsLAFDark } from "@/Styles/Themes/LAF/Dark";

// eslint-disable-next-line @typescript-eslint/ban-types
function createPoolParties(dates: Date[]): Object {
  return dates
    .map((date) => date.getTime())
    .map((x, i) => ({
      x,
      strokeDashArray: 2,
      borderColor: ColorsLAFDark.yellow,
      label: {
        text: i === 0 ? "Votium Pool Party" : "",
        orientation: "horizontal",
        borderColor: ColorsLAFDark.yellow,
        style: {
          color: "rgb(34, 34, 34)",
          background: ColorsLAFDark.yellow,
          fontFamily: "SF Mono, Consolas, monospace",
        },
      },
    }));
}

// eslint-disable-next-line @typescript-eslint/ban-types
export default function createAnnotations(start: Date): Object {
  return {
    annotations: {
      xaxis: createPoolParties(
        [
          new Date(Date.UTC(2021, 8, 21)),
          new Date(Date.UTC(2021, 9, 5)),
          new Date(Date.UTC(2021, 9, 19)),
          new Date(Date.UTC(2021, 10, 2)),
          new Date(Date.UTC(2021, 10, 16)),
          new Date(Date.UTC(2021, 10, 30)),
        ].filter((date) => date > start)
      ),
    },
  };
}
