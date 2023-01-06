<template>
  <Button
    class="button"
    :primary="true"
    @click="onConnect"
  >
    Connect Your Wallet
  </Button>
</template>

<script setup lang="ts">
import {
  useWalletStore,
  connectWallet,
  getProvider,
  isConnected,
} from "@/Wallet";
import { Button } from "@/Framework";

// Emits
const emit = defineEmits<{
  (e: "connected"): void;
}>();

// Refs
const store = useWalletStore();

// Methods
const onConnect = async (): Promise<void> => {
  await connectWallet(true);
  const provider = getProvider();
  const connected = await isConnected(provider);

  store.connected = connected;

  if (connected) {
    emit("connected");
  }
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.button {
  font-size: 1rem;
}
</style>
