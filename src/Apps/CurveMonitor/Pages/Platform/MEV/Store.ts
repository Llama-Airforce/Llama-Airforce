import { ref } from "vue";
import { defineStore } from "pinia";
import { type SandwichDetail } from "@CM/Services/Sockets/SocketMEV";

export const useMEVStore = defineStore("mevStore", () => {
  const sandwiches = ref<SandwichDetail[]>([]);
  const sandwichesPage = ref({ cur: 0, total: 0 });

  return {
    sandwiches,
    sandwichesPage,
  };
});
