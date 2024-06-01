import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { type Theme } from "@/Styles/Theme";
import {
  getColors,
  getColorsArray,
  getLineChartColors,
} from "@/Styles/Themes/PM";
import type { ThemeId } from "@PM/Models/ThemeId";
import type { Flavor } from "@PM/Models/Flavor";

type ThemePrisma = Theme & {
  lineChartColors: ReturnType<typeof getLineChartColors>;
};

export const useSettingsStore = defineStore("settingsStore", () => {
  const themeId = ref<ThemeId>("light");
  const flavor = ref<Flavor>("lsd");

  const theme = computed<ThemePrisma>(() => ({
    colors: getColors(themeId.value, flavor.value),
    colorsArray: getColorsArray(themeId.value, flavor.value),
    lineChartColors: getLineChartColors(themeId.value, flavor.value),
  }));

  return {
    themeId,
    flavor,

    theme,
  };
});
