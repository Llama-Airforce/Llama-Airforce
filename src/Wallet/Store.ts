import { defineStore } from "pinia";
import { type Network } from "@/Wallet/Network";

type State = {
  connected: boolean;
  network?: Network;
  address?: string;
};

export const useWalletStore = defineStore({
  id: "walletStore",
  state: (): State => ({
    address: undefined,
    connected: false,
    network: undefined,
  }),
  actions: {
    setAddress(address?: string) {
      this.address = address?.toLocaleLowerCase();
    },
  },
});
