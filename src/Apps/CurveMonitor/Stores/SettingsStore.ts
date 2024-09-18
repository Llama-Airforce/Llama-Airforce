import { type Theme } from "@/Styles/Theme";
import { colors } from "@/Styles/ChartTheme";
import type { ThemeId } from "@CM/Models";

export const useSettingsStore = defineStore("settingsStore", () => {
  const themeId = ref<ThemeId>("light");

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
    themeId,
    theme,
  };
});
