<template>
  <div class="buttons">
    <Button
      class="button"
      :primary="true"
      @click="onConnect"
    >
      {{ t("connect-your-wallet") }}
    </Button>

    <Tooltip class="tooltip">
      <template #item>
        <Button
          class="button clear"
          @click="onClearCache"
        >
          <i class="fas fa-trash"></i>
        </Button>
      </template>

      <div
        class="ping"
        v-html="t('clear-cache')"
      ></div>
    </Tooltip>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import {
  useWalletStore,
  connectWallet,
  getProvider,
  isConnected,
} from "@/Wallet";
import { Button, Tooltip } from "@/Framework";

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

const onClearCache = (): void => {
  window.localStorage.removeItem("connectedWallet");
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.buttons {
  display: flex;
  gap: 0.5rem;

  .button {
    font-size: 1rem;
  }

  .button:first-child {
    flex-grow: 1;
    font-size: 0.95rem;
  }
}
</style>

<i18n lang="yaml" locale="en">
connect-your-wallet: Connect Wallet
clear-cache: "<b>Clear Cache</b><br />
  Press this button to possibly solve the issue of a non-working connect button.<br />
  This problem often occurs when you switch between wallet extensions in your browser.<br />
  Try to connect again after pressing this button."
</i18n>

<i18n lang="yaml" locale="zh">
connect-your-wallet: 连接你的钱包
clear-cache: "<b>清除缓存</b><br />
  按下这个按钮，可能会解决连接按钮不工作的问题.<br />
  这个问题经常发生在你在浏览器中切换钱包扩展时.<br />
  按下这个按钮后，尝试再次连接."
</i18n>
