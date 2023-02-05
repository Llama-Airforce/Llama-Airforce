<template>
  <Button
    class="button"
    :primary="true"
    @click="onConnect"
  >
    {{ t("connect-your-wallet") }}
  </Button>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import {
  useWalletStore,
  connectWallet,
  getProvider,
  isConnected,
} from "@/Wallet";
import { Button } from "@/Framework";

const { t } = useI18n();

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

<i18n lang="yaml" locale="en">
connect-your-wallet: Connect Your Wallet
</i18n>

<i18n lang="yaml" locale="zh">
connect-your-wallet: 连接你的钱包
</i18n>
