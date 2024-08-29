import { type Theme } from "@/Styles/Theme";
import { getColors, getColorsArray } from "@/Styles/Themes/CB";
import type { ThemeId } from "@CB/Models/ThemeId";

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
