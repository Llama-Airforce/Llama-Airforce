import { ColorsCMDark, ColorsCMDarkArray } from "@/Styles/Themes/CM/Dark";
import { ColorsCMLight, ColorsCMLightArray } from "@/Styles/Themes/CM/Light";
import { ColorsCMChad, ColorsCMChadArray } from "@/Styles/Themes/CM/Chad";
import type { ThemeId } from "@CM/Models/ThemeId";

export function getColors(themeId: ThemeId) {
  switch (themeId) {
    case "chad":
      return ColorsCMChad;
    case "light":
      return ColorsCMLight;
    default:
      return ColorsCMDark;
  }
}

export function getColorsArray(themeId: ThemeId) {
  switch (themeId) {
    case "chad":
      return ColorsCMChadArray;
    case "light":
      return ColorsCMLightArray;
    default:
      return ColorsCMDarkArray;
  }
}
