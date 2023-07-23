import { defineStore } from "pinia";
import { type Market } from "@CM/Pages/Platform/CrvUsd/Services/CurveService";

type State = {
  market: Market | null;
};

export const useCrvUsdStore = defineStore({
  id: "curveUsdStore",
  state: (): State => ({
    market: null,
  }),
});
