import { defineStore } from "pinia";
import type { Page } from "@LAF/Pages/Page";

type State = {
  pages: Page[];
};

export const usePageStore = defineStore({
  id: "pageStore",
  state: (): State => ({
    pages: [],
  }),
});
