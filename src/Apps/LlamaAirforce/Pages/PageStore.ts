import type { Page } from "./Page";

export const usePageStore = defineStore("pageStore", () => {
  const pages = ref<Page[]>([]);

  return {
    pages,
  };
});
