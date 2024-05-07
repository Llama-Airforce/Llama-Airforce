import { ref } from "vue";
import { defineStore } from "pinia";
import type { Page } from "@LAF/Pages/Page";

export const usePageStore = defineStore("pageStore", () => {
  const pages = ref<Page[]>([]);

  return { pages };
});
