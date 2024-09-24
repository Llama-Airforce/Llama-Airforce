<script setup lang="ts">
import { useWallet } from "@/Wallet";

const { chainId } = defineProps<{
  chainId?: number;
}>();

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
  <button @click="onClick">
    <slot></slot>
  </button>
</template>

<style scoped>
button {
  --c-background: var(--c-variant, var(--c-lvl1));

  /* Base color to derive states like hover from */
  --c-states: var(--c-background);

  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  line-height: 1;
  padding: 0.5rem 1rem;
  background-color: var(--c-background);
  color: var(--c-text);
  user-select: none;
  cursor: pointer;

  /* Disable blue highlight because of pointer. */
  -webkit-tap-highlight-color: transparent;
  height: calc(40px - 1rem);

  border-radius: var(--border-radius);

  transition: background-color 125ms ease;

  &:disabled {
    pointer-events: none;
    background-color: hsl(
      from var(--c-primary) h s calc(l + 12 * var(--color-scheme-dark))
    );
  }

  &:hover:not(:disabled) {
    background-color: hsl(
      from var(--c-states) h s calc(l + 6 * var(--color-scheme-dark))
    );
  }

  &:active:not(:disabled) {
    background-color: hsl(
      from var(--c-states) h s calc(l + 12 * var(--color-scheme-dark))
    );
  }
}
</style>
