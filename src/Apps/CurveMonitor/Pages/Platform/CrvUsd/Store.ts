import { ref } from "vue";
import { defineStore } from "pinia";
import type { Market } from "@CM/Services/CrvUsd";

export const useCrvUsdStore = defineStore("crvUsdStore", () => {
  const market = ref<Market | undefined>(undefined);

  return {
    market,
  };
});
