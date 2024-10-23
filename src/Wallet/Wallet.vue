<script setup lang="ts">
import { mainnet } from "viem/chains";
import { useDisconnect, useSwitchChain } from "@wagmi/vue";
import { addressShort, useWallet } from "@/Wallet";
import WalletConnectButton from "@/Wallet/WalletConnectButton.vue";

const { labelPleaseConnect } = defineProps<{
  labelPleaseConnect?: string;
}>();

const { disconnect } = useDisconnect();
const { isConnected, chainId, address } = useWallet();
const { switchChain } = useSwitchChain();

const supportedNetwork = computed(() => chainId.value === mainnet.id);

const changeNetwork = () => {
  switchChain({ chainId: mainnet.id });
};

function onDisconnect() {
  disconnect(undefined, {
    onError: (err) => {
      notify({ text: prettyError(err), type: "error" });
    },
  });
}
</script>

<template>
  <div class="wallet">
    <div v-if="isConnected">
      <Button
        v-if="!supportedNetwork"
        class="change primary"
        @click="changeNetwork"
      >
        Change Network
      </Button>

      <Button
        v-else
        class="disconnect"
        @click="onDisconnect"
      >
        <LucideCheck /> {{ addressShort(address) }}
      </Button>
    </div>

    <div v-else>
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

<style scoped>
.wallet {
  .info {
    margin-top: 1rem;
    font-size: 0.75rem;
    color: #a1a1aa;
    text-align: center;

    @media only screen and (max-width: 1280px) {
      display: none;
    }
  }

  .change {
    justify-content: center;
  }

  .disconnect {
    justify-content: start;
  }

  > div {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
}
</style>
