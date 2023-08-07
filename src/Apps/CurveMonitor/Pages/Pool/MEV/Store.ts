import { defineStore } from "pinia";
import type { SocketMEV } from "@CM/Services/Sockets";
import {
  type SandwichDetail,
  type LabelRankingExtended,
  type LabelRankingShort,
} from "@CM/Services/Sockets/SocketMEV";

type State = {
  socket: SocketMEV | null;

  sandwiches: SandwichDetail[];
  labelRankingShort: LabelRankingShort[];
  labelRankingExtended: LabelRankingExtended[];
};

export const useMEVStore = defineStore({
  id: "mevStore",
  state: (): State => ({
    socket: null,

    sandwiches: [],
    labelRankingShort: [],
    labelRankingExtended: [],
  }),
});
