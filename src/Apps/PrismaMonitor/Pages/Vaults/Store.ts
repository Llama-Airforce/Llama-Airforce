import { defineStore } from "pinia";
import { type TroveManagerDetails } from "@PM/Services/Socket/TroveOverviewService";
import {
  type Trove,
} from "@PM/Services/PrismaService";

type State = {
  vault: TroveManagerDetails | null;
  trove: Trove | null;
};

export const useVaultStore = defineStore({
  id: "vaultStore",
  state: (): State => ({
    vault: null,
    trove: null,
  }),
  actions: {
    setTrove(trove: Trove) {
      this.trove = trove;
    },
  },
  getters: {
    getTrove() {
      return this.trove;
    },
  }
});
