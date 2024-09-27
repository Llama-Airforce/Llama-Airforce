<script setup lang="ts">
import { type Connector, useConnect, useConnectors } from "@wagmi/vue";

import injected from "@/Assets/Icons/Wallets/injected.webp";
import rabby from "@/Assets/Icons/Wallets/rabby.svg";
import walletconnect from "@/Assets/Icons/Wallets/walletconnect.webp";
import coinbase from "@/Assets/Icons/Wallets/coinbase.webp";
import safe from "@/Assets/Icons/Wallets/safe.webp";

const { connect } = useConnect();

const connectors = useConnectors();
const connectorsSupport = [
  "injected",
  "walletConnect",
  "coinbaseWalletSDK",
  "safe",
];
const connectorsFiltered = computed(() =>
  connectors.value.filter((x) => connectorsSupport.includes(x.id))
);

const showConnectors = ref(false);

function icon(connector: Connector) {
  switch (connector.id) {
    case "injected":
      return injected;
    case "walletConnect":
      return walletconnect;
    case "coinbaseWalletSDK":
      return coinbase;
    case "safe":
      return safe;
    case "io.rabby":
      return rabby;
    default:
      return "";
  }
}

function name(connector: Connector) {
  if (connector.id === "injected") {
    return "Browser Extension";
  }

  return connector.name;
}

function onConnect(connector: Connector) {
  connect({ connector });
  showConnectors.value = false;
}

function onClearCache() {
  console.log("nothing to do yet");
}
</script>

<template>
  <div class="buttons">
    <Button
      class="button primary"
      @click="showConnectors = true"
    >
      Connect Wallet
    </Button>

    <Tooltip
      v-if="false"
      class="tooltip"
    >
      <template #trigger>
        <Button
          class="button clear"
          @click="onClearCache"
        >
          <LucideTrash />
        </Button>
      </template>

      Clear Cache
    </Tooltip>

    <Modal
      :show="showConnectors"
      @close="showConnectors = false"
    >
      <Card>
        <div class="connectors-body">
          <div class="title">Connect Your Wallet</div>

          <div class="connectors">
            <Button
              v-for="connector in connectorsFiltered"
              :key="connector.id"
              class="connector"
              @click="onConnect(connector)"
            >
              <img
                v-if="icon(connector)"
                :src="icon(connector)"
              />
              <div
                v-else
                class="empty"
              ></div>

              <div class="name">{{ name(connector) }}</div>
            </Button>
          </div>
        </div>
      </Card>
    </Modal>
  </div>
</template>

<style scoped>
.connectors-body {
  width: 20rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;

  .title {
    font-size: 1.25rem;
    font-weight: bold;
    margin: 0.5rem 0rem;
    text-align: center;
  }

  .connectors {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .connector {
      justify-content: start;
      height: 2rem;
      gap: 1rem;
      background-color: var(--c-lvl2);

      &:hover {
        background-color: var(--c-lvl3);
      }

      img,
      .empty {
        width: 30px;
        height: 30px;
        object-fit: scale-down;
        border-radius: 25%;
      }
    }
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
