import { type Theme } from "@/Styles/Theme";
import { colors } from "@/Styles/ChartTheme";

export const useSettingsStore = defineStore("settingsStore", () => {
  const theme = computed<Theme>(() => ({
    colors: colors.value,
    colorsArray: [
      colors.value.blue,
      colors.value.yellow,
      colors.value.green,
      colors.value.red,
      colors.value.purple,
    ],
  }));

  return {
    theme,
  };
});
