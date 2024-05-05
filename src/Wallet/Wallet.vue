<template>
  <div class="wallet">
    <div
      v-if="connected"
      class="connected"
    >
      <div
        v-if="!supportedNetwork"
        class="unsupportedNetwork"
      >
        <Button
          class="changeNetwork"
          value="Change Network"
          :primary="true"
          @click="changeNetwork"
        ></Button>
        <span class="info">
          {{ t("incorrect-network") }}
        </span>
      </div>

      <Button
        class="disconnect"
        icon="fas fa-check"
        :value="addressShort(address)"
        @click="disconnectWallet"
      ></Button>
    </div>

    <div
      v-else
      class="notConnected"
    >
      <WalletConnectButton></WalletConnectButton>
      <span
        v-if="labelPleaseConnect"
        class="info"
      >
        {{ labelPleaseConnect }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/Framework";
import { addressShort, getAddress, useWallet } from "@/Wallet";
import WalletConnectButton from "@/Wallet/WalletConnectButton.vue";
import { useWalletStore } from "@/Wallet/Store";

const { t } = useI18n();

// Props
interface Props {
  labelPleaseConnect?: string;
}

const { labelPleaseConnect } = defineProps<Props>();

// Refs
const store = useWalletStore();
const {
  connected,
  network,
  address,
  connectWallet,
  disconnectWallet,
  getProvider,
  withProvider,
} = useWallet();

const supportedNetwork = computed(() => network.value === "ethereum");

// Hooks
onMounted(connectWallet);

// Watches
watch(
  connected,
  async (connected): Promise<void> => {
    // Don't use withProvider because there might no address, so it won't execute.
    const provider = getProvider();
    const address =
      provider && connected ? await getAddress(provider) : undefined;

    store.setAddress(address);
  },
  { immediate: true }
);

// Events
const changeNetwork = withProvider(async (provider) => {
  await provider.send("wallet_switchEthereumChain", [{ chainId: "0x1" }]);
  window.location.reload();
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.wallet {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > .connected {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    width: 100%;
  }

  .unsupportedNetwork {
    @media only screen and (max-width: 1280px) {
      display: none !important;
    }

    margin-bottom: 1rem;
  }

  .notConnected,
  .unsupportedNetwork {
    width: 100%;
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

<i18n lang="yaml" locale="en">
incorrect-network: You are not on the correct network; should be Ethereum
</i18n>
