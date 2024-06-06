<template>
  <button
    :class="{ primary: primary }"
    @click="onClick"
  >
    <slot>
      <i
        v-if="icon"
        class="icon"
        :class="[icon, { noValue: !!value }]"
      >
      </i>
      {{ value }}
    </slot>
  </button>
</template>

<script setup lang="ts">
import { useWallet } from "@/Wallet";

// Props
interface Props {
  icon?: string;
  value?: string;
  primary?: boolean;
  web3?: boolean;
}

const {
  icon = "",
  value = "",
  primary = false,
  web3 = false,
} = defineProps<Props>();

// Emits
const emit = defineEmits<{
  click: [];
}>();

// Refs
const { withProvider, network } = useWallet();

// Events
const onClick = async (evt: Event): Promise<void> => {
  evt.stopImmediatePropagation();

  if (web3 && isDevelopment()) {
    await withProvider(async (provider) => {
      if (network.value !== "ethereum") {
        await provider.send("wallet_switchEthereumChain", [{ chainId: "0x1" }]);
        window.location.reload();
      }
    })();
  }

  emit("click");
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

button {
  all: unset;
  display: flex;
  align-items: center;
  line-height: 1;
  padding: 0.5rem 1rem;
  color: var(--c-text);
  user-select: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent; // Disable blue highlight because of pointer.
  height: calc(40px - 1rem);

  border-radius: var(--border-radius);

  transition: background-color 125ms ease;

  .icon {
    display: flex;
    align-items: center;

    &.noValue {
      margin-right: 1rem;
    }
  }

  background: var(--c-lvl1);

  &:disabled {
    pointer-events: none;
    background: var(--c-primary-disabled);
  }

  &:hover:not(:disabled) {
    background: var(--container-background-hover);
  }

  &:active:not(:disabled) {
    background: var(--container-background-active);
  }

  &.primary:not(:disabled) {
    background-color: var(--c-primary);

    &:hover {
      background-color: var(--c-primary-hover);
    }

    &:active {
      background-color: var(--c-primary-active);
    }
  }
}
</style>
