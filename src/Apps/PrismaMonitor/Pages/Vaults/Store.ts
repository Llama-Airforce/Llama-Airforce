import { defineStore } from "pinia";
import { type TroveManagerDetails } from "@PM/Services/Socket/TroveOverviewService";
import { type Trove } from "@PM/Services/TroveService";

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
});
