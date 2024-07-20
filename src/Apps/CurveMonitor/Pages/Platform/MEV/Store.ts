import { ref } from "vue";
import { defineStore } from "pinia";
import {
  type SandwichDetail,
  type LabelRankingExtended,
  type LabelRankingShort,
} from "@CM/Services/Sockets/SocketMEV";

export const useMEVStore = defineStore("mevStore", () => {
  const sandwiches = ref<SandwichDetail[]>([]);
  const sandwichesPage = ref({ cur: 0, total: 0 });

  const labelRankingShort = ref<LabelRankingShort[]>([]);
  const labelRankingExtended = ref<LabelRankingExtended[]>([]);

  return {
    sandwiches,
    sandwichesPage,
    labelRankingShort,
    labelRankingExtended,
  };
});
