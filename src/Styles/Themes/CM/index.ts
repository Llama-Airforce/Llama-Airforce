import type { Theme } from "@/Apps/CurveMonitor/Models/Theme";
import { ColorsCMDark, ColorsCMDarkArray } from "@/Styles/Themes/CM/Dark";
import { ColorsCMLight, ColorsCMLightArray } from "@/Styles/Themes/CM/Light";
import { ColorsCMChad, ColorsCMChadArray } from "@/Styles/Themes/CM/Chad";

export function getColors(theme: Theme) {
  if (theme === "chad") {
    return ColorsCMChad;
  } else if (theme === "light") {
    return ColorsCMLight;
  } else {
    return ColorsCMDark;
  }
}

export function getColorsArray(theme: Theme) {
  if (theme === "chad") {
    return ColorsCMChadArray;
  } else if (theme === "light") {
    return ColorsCMLightArray;
  } else {
    return ColorsCMDarkArray;
  }
}
