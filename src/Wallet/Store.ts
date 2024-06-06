import { ref } from "vue";
import { defineStore } from "pinia";
import { type Network } from "@/Wallet/Network";

export const useWalletStore = defineStore("walletStore", () => {
  const address = ref<string | undefined>();
  const connected = ref(false);
  const network = ref<Network>();

  function setAddress(newAddress?: string) {
    address.value = newAddress?.toLocaleLowerCase();
  }

  return { address, connected, network, setAddress };
});
