import { defineStore } from "pinia";
import { type TroveManagerDetails, type Trove } from "@PM/Services";

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
