import { ref } from "vue";
import { defineStore } from "pinia";
import { type Page } from "@/Framework/Monitor/Page";

export const usePageStore = defineStore("pageStore", () => {
  const pages = ref<Page[]>([]);

  return { pages };
});
