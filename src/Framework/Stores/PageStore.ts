import { ref } from "vue";
import { type RouteRecordRaw } from "vue-router";
import { defineStore } from "pinia";
import { type Page } from "@/Framework/Monitor/Page";

export const usePageStore = <TPage extends Page>() =>
  defineStore("pageStore", () => {
    const pages = ref<TPage[]>([]);
    const routes = ref<RouteRecordRaw[][]>([]);

    return {
      pages,
      routes,
    };
  })();
