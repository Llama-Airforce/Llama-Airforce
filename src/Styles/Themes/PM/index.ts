import type { ThemeId } from "@PM/Models/ThemeId";
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

export function getColors(themeId: ThemeId, flavor: Flavor) {
  switch (themeId) {
    case "light":
      return flavor === "lsd" ? ColorsPMLightLsd : ColorsPMLightLrt;
    default:
      return flavor === "lsd" ? ColorsPMDarkLsd : ColorsPMDarkLrt;
  }
}

export function getColorsArray(themeId: ThemeId, flavor: Flavor) {
  switch (themeId) {
    case "light":
      return flavor === "lsd" ? ColorsPMLightArrayLsd : ColorsPMLightArrayLrt;
    default:
      return flavor === "lsd" ? ColorsPMDarkArrayLsd : ColorsPMDarkArrayLrt;
  }
}

export function getLineChartColors(themeId: ThemeId, flavor: Flavor) {
  const colors = getColors(themeId, flavor);

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
