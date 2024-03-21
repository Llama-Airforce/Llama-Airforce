import type { Theme } from "@PM/Models/Theme";
import type { Flavor } from "@PM/Models/Flavor";
import {
  ColorsPMDarkLsd,
  ColorsPMDarkLrt,
  ColorsPMDarkArrayLsd,
  ColorsPMDarkArrayLrt,
} from "@/Styles/Themes/PM/Dark";
import {
  ColorsPMLightLsd,
  ColorsPMLightLrt,
  ColorsPMLightArrayLsd,
  ColorsPMLightArrayLrt,
} from "@/Styles/Themes/PM/Light";

export function getColors(theme: Theme, flavor: Flavor) {
  if (theme === "light") {
    if (flavor === "lsd") {
      return ColorsPMLightLsd;
    }

    return ColorsPMLightLrt;
  }

  if (flavor === "lsd") {
    return ColorsPMDarkLsd;
  }

  return ColorsPMDarkLrt;
}

export function getColorsArray(theme: Theme, flavor: Flavor) {
  if (theme === "light") {
    if (flavor === "lsd") {
      return ColorsPMLightArrayLsd;
    }

    return ColorsPMLightArrayLrt;
  }

  if (flavor === "lsd") {
    return ColorsPMDarkArrayLsd;
  }

  return ColorsPMDarkArrayLrt;
}

export function getLineChartColors(theme: Theme, flavor: Flavor) {
  const colors = getColors(theme, flavor);

  if (flavor === "lsd") {
    return {
      lineColor: colors.blue,
      topColor: "rgb(32, 129, 240, 0.2)",
      bottomColor: "rgba(32, 129, 240, 0)",
    };
  }

  return {
    lineColor: colors.purple,
    topColor: "rgb(163, 91, 251, 0.2)",
    bottomColor: "rgba(163, 91, 251, 0)",
  };
}
