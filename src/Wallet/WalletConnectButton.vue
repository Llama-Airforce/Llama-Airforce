<template>
  <div class="buttons">
    <Button
      class="button"
      :primary="true"
      @click="showConnectors = true"
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

    <Modal
      :show="showConnectors"
      @close="showConnectors = false"
    >
      <Card>
        <div class="connectors-body">
          <div
            v-for="connector in connectors"
            :key="connector.id"
            class="connector"
          >
            {{ connector.name }}
            <Button
              :primary="true"
              @click="onConnect(connector)"
            >
              Connect
            </Button>
          </div>
        </div>
      </Card>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { type Connector } from "@wagmi/vue";
import { useWallet } from "@/Wallet";

const { t } = useI18n();

const { connectors, connect } = useWallet();

const showConnectors = ref(false);

const onConnect = (connector: Connector) => {
  connect({ connector });
  showConnectors.value = false;
};

const onClearCache = () => {
  console.log("nothing to do yet");
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.connectors-body {
  width: 20rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;

  .connector {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.buttons {
  display: flex;
  gap: 0.5rem;

  .button {
    font-size: 1rem;
    justify-content: center;
  }

  .button:first-child {
    flex-grow: 1;
    font-size: 0.95rem;
  }
}
</style>

<i18n lang="yaml" locale="en">
connect-your-wallet: Connect Wallet
</i18n>

<i18n lang="yaml" locale="zh">
connect-your-wallet: 连接你的钱包
</i18n>
