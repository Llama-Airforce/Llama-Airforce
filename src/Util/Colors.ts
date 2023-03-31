import type { Theme } from "@/Apps/CurveMonitor/Models/Theme";

export const ColorsDark = {
  blue: "rgb(32, 129, 240)",
  yellow: "rgb(255, 204, 0)",
  green: "rgb(126, 217, 87)",
  red: "rgb(255, 87, 87)",
  purple: "rgb(140, 82, 255)",

  backgroundColor: "#212124",
  level1: "#212124",
  level2: "#27272a",
  level3: "#303034",
  level4: "#35353b",
  level5: "#71717a",
  level6: "#aea8af",

  text: "#fafafa",
};

export const ColorsDarkArray = [
  ColorsDark.blue,
  ColorsDark.yellow,
  ColorsDark.green,
  ColorsDark.red,
  ColorsDark.purple,
];

export const ColorsLight = {
  blue: "#058de1",
  yellow: "#F8BC40",
  green: "#35d190",
  red: "#f84b5f",
  purple: "#c868ee",

  backgroundColor: "#f5f5f5",
  level1: "#fafafa",
  level2: "#f2f2f2",
  level3: "#ebebeb",
  level4: "#a1a1a1",
  level5: "#27272a",
  level6: "#212124",

  text: "#333333",
};

export const ColorsLightArray = [
  ColorsLight.blue,
  ColorsLight.yellow,
  ColorsLight.green,
  ColorsLight.red,
  ColorsLight.purple,
];

export function getColors(theme: Theme) {
  if (theme === "light") {
    return ColorsLight;
  } else {
    return ColorsDark;
  }
}

export function getColorsArray(theme: Theme) {
  if (theme === "light") {
    return ColorsLightArray;
  } else {
    return ColorsDarkArray;
  }
}
