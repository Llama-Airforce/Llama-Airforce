<script setup lang="ts">
import { useWallet } from "@/Wallet";

// Props
interface Props {
  icon?: string;
  value?: string;
  primary?: boolean;
  chainId?: number;
}

const {
  icon = "",
  value = "",
  primary = false,
  chainId,
} = defineProps<Props>();

// Emits
const emit = defineEmits<{
  click: [];
}>();

// Refs
const { chainId: chainIdCurrent } = useWallet();
const { switchChain } = useSwitchChain();

// Events
const onClick = (evt: Event) => {
  evt.stopImmediatePropagation();

  if (chainId) {
    if (chainIdCurrent.value === undefined) {
      notify({ text: "Wallet not connected", type: "error" });
      return;
    }

    if (chainIdCurrent.value !== chainId) {
      switchChain({ chainId });
    }
  }

  emit("click");
};
</script>

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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

button {
  all: unset;
  display: flex;
  align-items: center;
  line-height: 1;
  padding: 0.5rem 1rem;
  background: var(--c-lvl1);
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
