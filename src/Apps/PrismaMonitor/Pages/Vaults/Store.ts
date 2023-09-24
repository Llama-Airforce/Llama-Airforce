import { defineStore } from "pinia";
import {type TroveManagerDetails} from "@PM/Services/Socket/TroveOverviewService";

type State = {
  vault: TroveManagerDetails | null;
};

export const useVaultStore = defineStore({
  id: "vaultStore",
  state: (): State => ({
    vault: null,
  }),
});
