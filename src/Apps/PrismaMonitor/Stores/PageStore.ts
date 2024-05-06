import { defineStore } from "pinia";
import { type Page } from "@/Framework/Monitor/Page";

type State = {
  pages: Page[];
};

export const usePageStore = defineStore({
  id: "pageStore",
  state: (): State => ({
    pages: [],
  }),
});
