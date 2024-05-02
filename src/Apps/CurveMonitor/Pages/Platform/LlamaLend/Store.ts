import { defineStore } from "pinia";
import { type Chain } from "@CM/Models/Chain";
import { type Market } from "@CM/Pages/Platform/LlamaLend/Models/Market";

type State = {
  market: Market | null;
  chain: Chain | null;
};

export const useLlamaLendStore = defineStore({
  id: "llamaLendStore",
  state: (): State => ({
    market: null,
    chain: null,
  }),
});
