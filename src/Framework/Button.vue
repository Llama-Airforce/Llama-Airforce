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
import { isDevelopment } from "@/Util/DevHelper";
import { getProvider, isMainnet } from "@/Wallet";

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
  (e: "click"): void;
}>();

// Events
const onClick = async (evt: Event): Promise<void> => {
  evt.stopImmediatePropagation();

  if (web3 && isDevelopment()) {
    const provider = getProvider();
    if (!provider) {
      return;
    }

    const isCorrectNetwork = await isMainnet(provider);

    if (!isCorrectNetwork) {
      await provider.send("wallet_switchEthereumChain", [{ chainId: "0x1" }]);
      window.location.reload();
    }
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
  padding: 0.5rem 1rem;
  color: var(--c-text);
  user-select: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent; // Disable blue highlight because of pointer.
  height: calc(40px - 1rem);

  border-radius: var(--border-radius);

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
