<script setup lang="ts">
import { mainnet } from "viem/chains";
import { useDisconnect, useSwitchChain } from "@wagmi/vue";
import { addressShort, useWallet } from "@/Wallet";
import WalletConnectButton from "@/Wallet/WalletConnectButton.vue";

const { t } = useI18n();

// Props
interface Props {
  labelPleaseConnect?: string;
}

const { labelPleaseConnect } = defineProps<Props>();

// Refs
const { disconnect } = useDisconnect();
const { isConnected, chainId, address } = useWallet();
const { switchChain } = useSwitchChain();

const supportedNetwork = computed(() => chainId.value === mainnet.id);

// Events
const changeNetwork = () => {
  switchChain({ chainId: mainnet.id });
};
</script>

<template>
  <div class="wallet">
    <div
      v-if="isConnected"
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
        @click="disconnect"
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
    margin-bottom: 1rem;

    @media only screen and (max-width: 1280px) {
      display: none !important;
    }
  }

  .notConnected,
  .unsupportedNetwork {
    width: 100%;
    display: flex;
    flex-direction: column;

    > .info {
      margin-top: 1rem;
      font-size: 0.75rem;
      color: #a1a1aa;
      text-align: center;

      @media only screen and (max-width: 1280px) {
        display: none;
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
incorrect-network: You are not on the correct network; should be Ethereum
</i18n>
