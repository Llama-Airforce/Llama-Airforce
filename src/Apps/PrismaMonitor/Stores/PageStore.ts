import { defineStore } from "pinia";
import { type Page } from "@/Framework/Monitor";

type State = {
  pages: Page[];
};

export const usePageStore = defineStore({
  id: "pageStore",
  state: (): State => ({
    pages: [],
  }),
});
