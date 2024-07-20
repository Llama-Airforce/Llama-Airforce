import { ref } from "vue";
import { defineStore } from "pinia";
import type { SocketMEV } from "@CM/Services/Sockets";
import {
  type SandwichDetail,
  type LabelRankingExtended,
  type LabelRankingShort,
} from "@CM/Services/Sockets/SocketMEV";

export const useMEVStore = defineStore("mevStore", () => {
  const socket = ref<SocketMEV | null>(null);

  const sandwiches = ref<SandwichDetail[]>([]);
  const sandwichesPage = ref({ cur: 0, total: 0 });

  const labelRankingShort = ref<LabelRankingShort[]>([]);
  const labelRankingExtended = ref<LabelRankingExtended[]>([]);

  return {
    socket,
    sandwiches,
    sandwichesPage,
    labelRankingShort,
    labelRankingExtended,
  };
});
