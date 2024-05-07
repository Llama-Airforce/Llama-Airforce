import { ref } from "vue";
import { defineStore } from "pinia";
import { type Chain } from "@CM/Models/Chain";
import { type Market } from "@CM/Pages/Platform/LlamaLend/Models/Market";

export const useLlamaLendStore = defineStore("llamaLendStore", () => {
  const market = ref<Market | null>(null);
  const chain = ref<Chain | null>(null);

  return {
    market,
    chain,
  };
});
