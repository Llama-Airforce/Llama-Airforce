import { defineStore } from "pinia";
import { type Market } from "@CM/Pages/Platform/LlamaLend/Models/Market";

type State = {
  market: Market | null;
};

export const useLlamaLendStore = defineStore({
  id: "llamaLendStore",
  state: (): State => ({
    market: null,
  }),
});
