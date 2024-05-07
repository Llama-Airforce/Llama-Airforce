import { ref } from "vue";
import { defineStore } from "pinia";
import { type Page } from "@/Framework/Monitor/Page";

export const usePageStore = <TPage extends Page>() =>
  defineStore("pageStore", () => {
    const pages = ref<TPage[]>([]);

    return {
      pages,
    };
  })();
