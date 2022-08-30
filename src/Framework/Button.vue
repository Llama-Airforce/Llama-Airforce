<template>
  <button
    :class="{ primary: primary }"
    @click="onClick"
  >
    <slot>
      <i
        v-if="icon"
        class="icon"
        :class="icon"
      >
      </i>
      {{ value }}
    </slot>
  </button>
</template>

<script
  setup
  lang="ts"
>
import { isDevelopment } from "@/Util/DevHelper";
import { getProvider } from "@/Wallet/ProviderFactory";
import { isMainnet } from "@/Wallet/WalletHelper";

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

<style
  lang="scss"
  scoped
>
@import "@/Styles/Variables.scss";

button {
  all: unset;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  color: $text;
  user-select: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent; // Disable blue highlight because of pointer.
  height: calc(40px - 1rem);

  border-radius: 0;

  .icon {
    display: flex;
    align-items: center;
    margin-right: 1rem;
  }

  background: $background-color-widget;

  &:disabled {
    pointer-events: none;
    background: lighten($blue, 15%);
  }

  &:hover:not(:disabled) {
    background: $datatable-background-hover;
  }

  &:active:not(:disabled) {
    background: $datatable-background-active;
  }

  &.primary:not(:disabled) {
    background-color: $blue;

    &:hover {
      background-color: lighten($blue, 10%);
    }

    &:active {
      background-color: lighten($blue, 20%);
    }
  }
}
</style>
