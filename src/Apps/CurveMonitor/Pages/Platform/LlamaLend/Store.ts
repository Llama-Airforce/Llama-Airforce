import { ref } from "vue";
import { defineStore } from "pinia";
import { type Chain } from "@CM/Models/Chain";
import { type Market } from "@CM/Services/LlamaLend";

export const useLlamaLendStore = defineStore("llamaLendStore", () => {
  const market = ref<Market | undefined>(undefined);
  const chain = ref<Chain | undefined>(undefined);

  return {
    market,
    chain,
  };
});
