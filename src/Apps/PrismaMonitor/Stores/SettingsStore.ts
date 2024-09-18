import { type Theme } from "@/Styles/Theme";
import { colors } from "@/Styles/ChartTheme";
import type { ThemeId } from "@PM/Models/ThemeId";
import type { Flavor } from "@PM/Models/Flavor";

type ThemePrisma = Theme & {
  lineChartColors: {
    lineColor: string;
    topColor: string;
    bottomColor: string;
  };
};

export const useSettingsStore = defineStore("settingsStore", () => {
  const themeId = ref<ThemeId>("light");
  const flavor = ref<Flavor>("lsd");

  const theme = computed<ThemePrisma>(() => ({
    colors: colors.value,
    colorsArray: [
      flavor.value === "lsd" ? colors.value.blue : colors.value.purple,
      colors.value.yellow,
      colors.value.green,
      colors.value.red,
      flavor.value === "lsd" ? colors.value.purple : colors.value.blue,
    ],
    lineChartColors:
      flavor.value === "lsd"
        ? {
            lineColor: colors.value.blue,
            topColor: "rgb(32, 129, 240, 0.2)",
            bottomColor: "rgba(32, 129, 240, 0)",
          }
        : {
            lineColor: colors.value.purple,
            topColor: "rgb(163, 91, 251, 0.2)",
            bottomColor: "rgba(163, 91, 251, 0)",
          },
  }));

  return {
    themeId,
    theme,
    flavor,
  };
});
