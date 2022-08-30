import { defineStore } from "pinia";

type State = {
  connected: boolean;
  correctNetwork: boolean;
  address?: string;
};

export const useWalletStore = defineStore({
  id: "walletStore",
  state: (): State => ({
    address: undefined,
    connected: false,
    correctNetwork: false,
  }),
  actions: {
    setAddress(address?: string) {
      this.address = address?.toLocaleLowerCase();
    },
  },
});
