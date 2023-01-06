<template>
  <div class="wallet">
    <div
      v-if="connected"
      class="connected"
    >
      <div
        v-if="!correctNetwork"
        class="incorrectNetwork"
      >
        <Button
          class="changeNetwork"
          value="Change Network"
          :primary="true"
          @click="changeNetwork"
        ></Button>
        <span class="info">
          You are not on the correct network; should be Ethereum
        </span>
      </div>

      <Button
        class="disconnect"
        icon="fas fa-check"
        :value="address"
        @click="onDisconnect"
      ></Button>
    </div>

    <div
      v-else
      class="notConnected"
    >
      <WalletConnectButton></WalletConnectButton>
      <span class="info">
        Connect your wallet to see your personal earnings in each round
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted } from "vue";
import { $computed } from "vue/macros";
import { Button } from "@/Framework";
import {
  WalletConnectButton,
  useWalletStore,
  getProvider,
  clearProvider,
  connectWallet,
  isConnected,
  getAddress,
  addressShort,
  isMainnet,
} from "@/Wallet";

// Refs
const store = useWalletStore();

const connected = $computed((): boolean => {
  return store.connected;
});

const correctNetwork = $computed((): boolean => {
  return store.correctNetwork;
});

const address = $computed((): string => {
  return addressShort(store.address);
});

onMounted(async (): Promise<void> => {
  await connectWallet();
  const provider = getProvider();

  const connected = await isConnected(provider);
  store.connected = connected;

  const correctNetwork = await isMainnet(provider);
  store.correctNetwork = correctNetwork;
});

// Watches
watch(
  () => store.connected,
  async (connected): Promise<void> => {
    const provider = getProvider();
    const address =
      provider && connected ? await getAddress(provider) : undefined;

    store.setAddress(address);
  },
  { immediate: true }
);

// Events
const changeNetwork = async (): Promise<void> => {
  const provider = getProvider();
  if (!provider) {
    return;
  }

  await provider.send("wallet_switchEthereumChain", [{ chainId: "0x1" }]);
  window.location.reload();
};

const onDisconnect = async (): Promise<void> => {
  await clearProvider();

  store.connected = false;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.wallet {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  button {
    @media only screen and (max-width: 1280px) {
      margin: 0 1rem;
    }
  }

  > .connected {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    width: 100%;
  }

  .incorrectNetwork {
    @media only screen and (max-width: 1280px) {
      display: none !important;
    }

    margin-bottom: 2rem;
  }

  .notConnected,
  .incorrectNetwork {
    display: flex;

    flex-direction: column;

    > .info {
      @media only screen and (max-width: 1280px) {
        display: none;
      }

      margin-top: 1rem;
      font-size: 0.75rem;
      color: #a1a1aa;
      text-align: center;
    }
  }
}
</style>
