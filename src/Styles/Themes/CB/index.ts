import type { Theme } from "@CB/Models/Theme";
import { ColorsCBDark, ColorsCBDarkArray } from "@/Styles/Themes/CB/Dark";
import { ColorsCBLight, ColorsCBLightArray } from "@/Styles/Themes/CB/Light";
import { ColorsCBChad, ColorsCBChadArray } from "@/Styles/Themes/CB/Chad";

export function getColors(theme: Theme) {
  if (theme === "chad") {
    return ColorsCBChad;
  } else if (theme === "light") {
    return ColorsCBLight;
  } else {
    return ColorsCBDark;
  }
}

export function getColorsArray(theme: Theme) {
  if (theme === "chad") {
    return ColorsCBChadArray;
  } else if (theme === "light") {
    return ColorsCBLightArray;
  } else {
    return ColorsCBDarkArray;
  }
}
