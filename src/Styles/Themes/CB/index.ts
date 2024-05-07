import { ColorsCBDark, ColorsCBDarkArray } from "@/Styles/Themes/CB/Dark";
import { ColorsCBLight, ColorsCBLightArray } from "@/Styles/Themes/CB/Light";
import { ColorsCBChad, ColorsCBChadArray } from "@/Styles/Themes/CB/Chad";
import type { ThemeId } from "@CB/Models/ThemeId";

export function getColors(themeId: ThemeId) {
  switch (themeId) {
    case "chad":
      return ColorsCBChad;
    case "light":
      return ColorsCBLight;
    default:
      return ColorsCBDark;
  }
}

export function getColorsArray(themeId: ThemeId) {
  switch (themeId) {
    case "chad":
      return ColorsCBChadArray;
    case "light":
      return ColorsCBLightArray;
    default:
      return ColorsCBDarkArray;
  }
}
