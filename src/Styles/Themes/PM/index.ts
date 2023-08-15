import type { Theme } from "@/Apps/CurveMonitor/Models/Theme";
import { ColorsPMDark, ColorsPMDarkArray } from "@/Styles/Themes/PM/Dark";
import { ColorsPMLight, ColorsPMLightArray } from "@/Styles/Themes/PM/Light";

export function getColors(theme: Theme) {
  if (theme === "light") {
    return ColorsPMLight;
  } else {
    return ColorsPMDark;
  }
}

export function getColorsArray(theme: Theme) {
  if (theme === "light") {
    return ColorsPMLightArray;
  } else {
    return ColorsPMDarkArray;
  }
}
