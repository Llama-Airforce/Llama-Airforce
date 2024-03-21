import { defineStore } from "pinia";
import { type Theme } from "@PM/Models/Theme";
import { type Flavor } from "@PM/Models/Flavor";

type State = {
  theme: Theme;
  flavor: Flavor;
};

export const useSettingsStore = defineStore({
  id: "settingsStore",
  state: (): State => ({
    theme: "light",
    flavor: "lrt",
  }),
});
