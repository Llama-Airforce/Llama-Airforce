import { type Theme } from "@/Styles/Theme";
import { getColors, getColorsArray } from "@/Styles/Themes/CM";
import type { ThemeId } from "@CM/Models";

export const useSettingsStore = defineStore("settingsStore", () => {
  const themeId = ref<ThemeId>("light");

  const theme = computed<Theme>(() => ({
    colors: getColors(themeId.value),
    colorsArray: getColorsArray(themeId.value),
  }));

  return {
    themeId,

    theme,
  };
});
