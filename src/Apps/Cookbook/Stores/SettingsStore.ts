import { defineStore } from "pinia";
import type { Theme } from "@CB/Models/Theme";

type State = {
  theme: Theme;
};

export const useSettingsStore = defineStore({
  id: "settingsStore",
  state: (): State => ({
    theme: "light",
  }),
});
