import { ref } from "vue";
import { defineStore } from "pinia";
import { type Market } from "@CM/Pages/Platform/CrvUsd/Services/CurveService";

export const useCrvUsdStore = defineStore("crvUsdStore", () => {
  const market = ref<Market | null>(null);

  return {
    market,
  };
});
